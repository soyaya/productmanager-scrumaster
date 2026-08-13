export function chunkText(text) {
  return text
    .split(/\n## /)
    .filter(Boolean)
    .map((chunk, index) => {
      const cleanedChunk = index === 0
        ? chunk
        : `## ${chunk}`;

      return {
        id: index + 1,
        text: cleanedChunk.trim()
      };
    });
}