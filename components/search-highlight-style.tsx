const SEARCH_HIGHLIGHT_CSS = `
::highlight(fd-search) {
  color: var(--color-fd-primary);
  text-decoration-line: underline;
}
`;

/** Search-match color and underline for the CSS Custom Highlight API.
 *  Kept out of the Tailwind bundle because Lightning CSS cannot parse ::highlight(). */
export function SearchHighlightStyle() {
  return <style dangerouslySetInnerHTML={{ __html: SEARCH_HIGHLIGHT_CSS }} />;
}
