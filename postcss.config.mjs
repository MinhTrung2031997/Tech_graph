import fs from 'node:fs';
import path from 'node:path';

// Fumadocs emits a search-highlight utility that Lightning CSS cannot parse.
// The pieces stay split so Tailwind does not detect the utility in this file.
// SearchHighlightStyle injects the real ::highlight() rule for the browser.
const root = process.cwd();
const pseudo = ['::', 'highlight', '(fd-search)'].join('');
const highlightClasses = ['text-fd-primary', 'underline'].map((utility) => `[&_${pseudo}]:${utility}`);

function stripHighlightCandidates(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const next = highlightClasses.reduce((css, candidate) => css.replaceAll(candidate, ''), source);
  if (next !== source) fs.writeFileSync(filePath, next);
}

stripHighlightCandidates(path.join(root, 'node_modules/fumadocs-ui/css/generated/shared.css'));
stripHighlightCandidates(path.join(root, 'node_modules/fumadocs-ui/dist/components/dialog/search.js'));

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
