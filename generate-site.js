const marked = require('marked'); // eslint-disable-line @typescript-eslint/no-var-requires
const fs = require('fs'); // eslint-disable-line @typescript-eslint/no-var-requires

const contentMarkdown = fs.readFileSync('./index.md', 'utf-8');
const contentRendered = marked(contentMarkdown);

const themeHtml = fs.readFileSync('./theme.html', 'utf-8');
const finalHtml = themeHtml.replace('<MarkdownContent/>', contentRendered)

fs.writeFileSync('./index.html', finalHtml);