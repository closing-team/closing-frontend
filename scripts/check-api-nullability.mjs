// 백엔드 OpenAPI 스펙과 src/types의 수기 타입 선언을 대조해, 스펙은 nullable인데
// 우리 타입은 non-null로 선언한 필드를 찾아낸다.
//
// 이런 드리프트가 생기면 TypeScript가 "여기엔 null 체크가 필요 없다"고 보증해버려서
// 런타임에 `Cannot read properties of null` 류의 크래시가 난다. 실제로 AI 세션의
// generatedTasks가 이 경우였다(스펙은 nullable, 타입은 배열 고정 → .map()에서 크래시).
//
// 사용: npm run check:api
// 기본 서버 주소는 .env의 VITE_API_BASE_URL을 쓰고, API_BASE_URL로 덮어쓸 수 있다.

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TYPES_DIR = join(ROOT, "src", "types");

// 개발 서버가 사설 인증서를 쓰기 때문에 이 스크립트에 한해 검증을 끈다.
// 로컬 개발 도구 전용이며 앱 런타임에는 영향이 없다.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function resolveBaseUrl() {
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL;

  try {
    const env = readFileSync(join(ROOT, ".env"), "utf8");
    const match = env.match(/^VITE_API_BASE_URL=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // .env가 없으면 아래에서 안내
  }
  return null;
}

// 주석을 걷어낸다. 보고하는 줄 번호가 원본과 어긋나지 않도록 줄 수는 그대로 보존한다.
// (\s는 개행까지 먹기 때문에 줄 안쪽 공백만 매칭하는 [^\S\n]을 쓴다)
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ""))
    .replace(/^[^\S\n]*\/\/.*$/gm, "");
}

// interface 본문에서 최상위 프로퍼티만 뽑아낸다. 중첩 객체 타입은 깊이로 걸러낸다.
function parseProperties(body, bodyStartOffset, source) {
  const properties = [];
  let depth = 0;
  let buffer = "";
  // 선언이 실제로 시작하는(공백이 아닌 첫 글자) 위치. 줄 번호 계산의 기준이 된다.
  let bufferStart = -1;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === "{" || char === "(" || char === "[") depth++;
    if (char === "}" || char === ")" || char === "]") depth--;

    if (bufferStart === -1 && !/\s/.test(char)) bufferStart = i;

    if ((char === ";" || char === "\n") && depth === 0) {
      const declaration = buffer.trim();
      // `name: type` 또는 `name?: type` 형태만 대상으로
      const match = declaration.match(/^(?:readonly\s+)?([A-Za-z_$][\w$]*)(\?)?\s*:\s*([\s\S]+)$/);
      if (match && bufferStart !== -1) {
        const [, name, optional, typeText] = match;
        const absolute = bodyStartOffset + bufferStart;
        properties.push({
          name,
          typeText: typeText.trim(),
          nullable: Boolean(optional) || /(^|\|)\s*null\s*(\||$)/.test(typeText),
          line: source.slice(0, absolute).split("\n").length,
        });
      }
      buffer = "";
      bufferStart = -1;
      continue;
    }
    buffer += char;
  }
  return properties;
}

function parseTypeFiles() {
  const interfaces = [];
  const files = readdirSync(TYPES_DIR).filter((f) => f.endsWith(".ts"));

  for (const file of files) {
    const raw = readFileSync(join(TYPES_DIR, file), "utf8");
    const source = stripComments(raw);
    const pattern = /(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)[^{]*\{/g;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      const bodyStart = pattern.lastIndex;
      let depth = 1;
      let i = bodyStart;
      while (i < source.length && depth > 0) {
        if (source[i] === "{") depth++;
        if (source[i] === "}") depth--;
        i++;
      }
      const body = source.slice(bodyStart, i - 1);
      interfaces.push({
        name: match[1],
        file: `src/types/${file}`,
        properties: parseProperties(body, bodyStart, source),
      });
    }
  }
  return interfaces;
}

function isNullable(schemaProperty) {
  const type = schemaProperty.type;
  if (Array.isArray(type) && type.includes("null")) return true;
  return schemaProperty.nullable === true;
}

// 프로퍼티 이름 집합이 얼마나 겹치는지(자카드 유사도)로 스펙 스키마에 대응하는
// 인터페이스를 고른다. 확신이 서는 수준으로만 짝을 짓고, 애매하면 매칭하지 않는다.
const MATCH_THRESHOLD = 0.6;

function matchInterface(specFields, interfaces) {
  const specSet = new Set(specFields);
  let best = null;

  for (const iface of interfaces) {
    const ifaceSet = new Set(iface.properties.map((p) => p.name));
    if (ifaceSet.size === 0) continue;

    let intersection = 0;
    for (const name of specSet) {
      if (ifaceSet.has(name)) intersection++;
    }
    const union = new Set([...specSet, ...ifaceSet]).size;
    const score = intersection / union;

    if (!best || score > best.score) {
      best = { iface, score };
    }
  }

  return best && best.score >= MATCH_THRESHOLD ? best : null;
}

async function main() {
  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    console.error(
      "API 주소를 찾지 못했습니다. .env에 VITE_API_BASE_URL을 두거나 API_BASE_URL 환경변수를 지정해주세요.",
    );
    process.exit(2);
  }

  const specUrl = `${baseUrl.replace(/\/$/, "")}/v3/api-docs`;
  let spec;
  try {
    const response = await fetch(specUrl, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      console.error(`스펙을 불러오지 못했습니다. (HTTP ${response.status}) ${specUrl}`);
      process.exit(2);
    }
    spec = await response.json();
  } catch (error) {
    console.error(`스펙 요청에 실패했습니다: ${specUrl}`);
    console.error(error.message);
    process.exit(2);
  }

  const schemas = spec.components?.schemas ?? {};
  const interfaces = parseTypeFiles();

  // 스펙 스키마명과 우리 타입명은 규칙이 서로 달라서(AiSessionMessageResponseDto →
  // SendAiSessionMessageResponseData) 이름만으로는 짝을 지을 수 없다. 대신 프로퍼티
  // 구성이 얼마나 겹치는지로 매칭한다. 이름이 달라도 필드 구성은 같기 때문에 훨씬 정확하다.
  const nullableSchemas = Object.entries(schemas).filter(([, schema]) =>
    Object.values(schema.properties ?? {}).some(isNullable),
  );

  const findings = [];
  const unmatched = [];

  for (const [schemaName, schema] of nullableSchemas) {
    const specFields = Object.keys(schema.properties ?? {});
    const match = matchInterface(specFields, interfaces);

    if (!match) {
      unmatched.push(schemaName);
      continue;
    }

    for (const [fieldName, property] of Object.entries(schema.properties ?? {})) {
      if (!isNullable(property)) continue;

      const declared = match.iface.properties.find((p) => p.name === fieldName);
      if (declared && !declared.nullable) {
        findings.push({
          schemaName,
          fieldName,
          description: property.description,
          iface: match.iface,
          property: declared,
        });
      }
    }
  }

  console.log(`스펙: ${specUrl}`);
  console.log(
    `nullable 필드를 가진 스키마 ${nullableSchemas.length}개, 검사한 인터페이스 ${interfaces.length}개`,
  );
  if (unmatched.length > 0) {
    console.log(`대응 타입을 찾지 못해 건너뛴 스키마: ${unmatched.join(", ")}`);
  }
  console.log("");

  if (findings.length === 0) {
    console.log("드리프트 없음: 스펙이 nullable로 표기한 필드가 모두 타입에도 반영돼 있습니다.");
    return;
  }

  console.log(`드리프트 ${findings.length}건을 찾았습니다.\n`);
  for (const finding of findings) {
    console.log(`  ${finding.iface.file}:${finding.property.line}`);
    console.log(`    ${finding.iface.name}.${finding.property.name}: ${finding.property.typeText}`);
    console.log(`    스펙(${finding.schemaName}.${finding.fieldName})은 nullable입니다.`);
    if (finding.description) {
      console.log(`    ${finding.description}`);
    }
    console.log("");
  }
  console.log("해당 필드를 `| null`로 선언하고, 사용하는 쪽에 null 가드를 추가해주세요.");
  process.exit(1);
}

main();
