export const MAX_UPLOAD_IMAGE_SIZE_MB = 10;

interface ImageFileFilterOptions {
  maxSizeMB?: number;
  accept?: string[];
}

export function filterValidImageFiles(
  files: File[],
  { maxSizeMB = MAX_UPLOAD_IMAGE_SIZE_MB, accept }: ImageFileFilterOptions = {},
): { valid: File[]; rejectedCount: number } {
  const valid = files.filter((file) => {
    const typeOk = accept
      ? accept.includes(file.type)
      : file.type.startsWith("image/");
    return typeOk && file.size <= maxSizeMB * 1024 * 1024;
  });
  return { valid, rejectedCount: files.length - valid.length };
}
