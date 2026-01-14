export function stripMarkdown(markdown: string): string {
  if (!markdown) return '';
  // Basic markdown stripping regex
  return markdown
    .replace(/#{1,6}\s?/g, '') // Headers
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Italic
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/\n/g, ' ') // Newlines to spaces
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .trim();
}
