const marked = require('marked'); // eslint-disable-line @typescript-eslint/no-var-requires
const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-var-requires

const contentMarkdown = fs.readFileSync('./docs/index.md', 'utf-8');
const contentRendered = marked(contentMarkdown);

const themeHtml = fs.readFileSync('./docs/theme.html', 'utf-8');
const finalHtml = themeHtml.replace('<MarkdownContent/>', contentRendered)

fs.writeFileSync('./docs/index.html', finalHtml);