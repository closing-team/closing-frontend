import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { useProductDetailQuery } from "../../hooks/useProducts";
import { SUPPORT_POSTS } from "../../mocks/support/mockSupport";
import {
  buildDocumentTitle,
  DEFAULT_DESCRIPTION,
  GUIDE_STEP_TITLES,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_TITLE,
  PAGE_DESCRIPTIONS,
  PAGE_TITLES,
} from "../../constants/pageMeta";

function matchRoute(pathname: string) {
  const keys = Object.keys(ROUTES) as (keyof typeof ROUTES)[];
  const staticKeys = keys.filter((key) => !ROUTES[key].includes(":"));
  const dynamicKeys = keys.filter((key) => ROUTES[key].includes(":"));

  for (const key of [...staticKeys, ...dynamicKeys]) {
    const match = matchPath({ path: ROUTES[key], end: true }, pathname);
    if (match) return { key, params: match.params };
  }

  return undefined;
}

function setMetaDescription(content: string) {
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", content);
}

export default function DocumentMeta() {
  const { pathname, search } = useLocation();
  const location = useUsedStore((s) => s.location);
  const matched = matchRoute(pathname);
  const productIdParam =
    matched?.key === "USED_DETAIL" || matched?.key === "CHAT_ROOM"
      ? Number(matched.params.productId)
      : undefined;
  const { data: product } = useProductDetailQuery(productIdParam, location);

  useEffect(() => {
    let title = matched ? PAGE_TITLES[matched.key] : undefined;
    const description = matched
      ? (PAGE_DESCRIPTIONS[matched.key] ?? DEFAULT_DESCRIPTION)
      : NOT_FOUND_DESCRIPTION;

    if (matched?.key === "GUIDE_DETAIL") {
      const stepTitle = GUIDE_STEP_TITLES[matched.params.stepId ?? ""];
      if (stepTitle) title = stepTitle;
    }

    if (matched?.key === "SUPPORT_DETAIL") {
      const post = SUPPORT_POSTS.find(
        (p) => String(p.supportId) === matched.params.supportId,
      );
      if (post) title = post.title;
    }

    if (matched?.key === "USED_DETAIL" || matched?.key === "CHAT_ROOM") {
      if (product) {
        title =
          matched.key === "CHAT_ROOM"
            ? `${product.sellerName ?? "판매자"}와의 채팅`
            : product.title;
      }
    }

    if (matched?.key === "USED_SEARCH_RESULT") {
      const query = new URLSearchParams(search).get("q");
      if (query) title = `'${query}' 검색결과`;
    }

    document.title = buildDocumentTitle(matched ? title : NOT_FOUND_TITLE);
    setMetaDescription(description);
  }, [pathname, search, matched, product]);

  return null;
}
