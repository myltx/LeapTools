export type ImageOutputFormat = "image/webp" | "image/jpeg" | "image/png";

export type ImageCompressionOptions = {
  format: ImageOutputFormat;
  quality: number;
  maxWidth: number | null;
  maxHeight: number | null;
};

export type ImageCompressionResult = {
  blob: Blob;
  width: number;
  height: number;
  format: ImageOutputFormat;
};

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** idx;
  const formatted = value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);
  return `${formatted} ${units[idx]}`;
}

function clampQuality(quality: number) {
  if (!Number.isFinite(quality)) return 0.8;
  return Math.min(1, Math.max(0.05, quality));
}

function computeTargetSize(
  src: { width: number; height: number },
  constraints: { maxWidth: number | null; maxHeight: number | null },
) {
  const maxW = constraints.maxWidth && constraints.maxWidth > 0 ? constraints.maxWidth : null;
  const maxH = constraints.maxHeight && constraints.maxHeight > 0 ? constraints.maxHeight : null;
  if (!maxW && !maxH) return src;

  const ratioW = maxW ? maxW / src.width : 1;
  const ratioH = maxH ? maxH / src.height : 1;
  const ratio = Math.min(ratioW, ratioH, 1);
  return { width: Math.max(1, Math.round(src.width * ratio)), height: Math.max(1, Math.round(src.height * ratio)) };
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageOutputFormat,
  quality: number,
): Promise<Blob> {
  return await new Promise<Blob>((resolve, reject) => {
    const q = format === "image/png" ? undefined : clampQuality(quality);
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error("图片编码失败"));
        else resolve(b);
      },
      format,
      q,
    );
  });
}

export async function compressImage(file: File, options: ImageCompressionOptions): Promise<ImageCompressionResult> {
  const bitmap = await createImageBitmap(file);
  const target = computeTargetSize(
    { width: bitmap.width, height: bitmap.height },
    { maxWidth: options.maxWidth, maxHeight: options.maxHeight },
  );

  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法创建绘图上下文");
  ctx.drawImage(bitmap, 0, 0, target.width, target.height);

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  return { blob, width: target.width, height: target.height, format: options.format };
}

