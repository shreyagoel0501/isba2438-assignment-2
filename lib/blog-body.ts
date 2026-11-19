export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string };

const IMAGE_MARKER = /^\[image:\s*([^\]|]+)\s*\|\s*([^\]]+)\]$/;
const VIDEO_MARKER = /^\[video:\s*([^\]|]+)\s*\|\s*([^\]]+)\]$/;

function isMediaSrc(src: string): boolean {
  return src.startsWith("/blog/") || src.startsWith("https://");
}

export function parseBody(body: string): BlogBlock[] {
  return body
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const image = chunk.match(IMAGE_MARKER);
      if (image && isMediaSrc(image[1].trim())) {
        return { type: "image" as const, src: image[1].trim(), alt: image[2].trim() };
      }
      const video = chunk.match(VIDEO_MARKER);
      if (video && isMediaSrc(video[1].trim())) {
        return { type: "video" as const, src: video[1].trim(), alt: video[2].trim() };
      }
      return { type: "paragraph" as const, text: chunk };
    });
}

export function blocksToBody(blocks: BlogBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "image") return `[image: ${block.src} | ${block.alt}]`;
      if (block.type === "video") return `[video: ${block.src} | ${block.alt}]`;
      return block.text;
    })
    .join("\n\n");
}
