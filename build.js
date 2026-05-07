const fs = require('fs');
const path = require('path');

// ===== CONFIGURAÇÃO =====
const BASE_URL = 'https://fotografiabelica.com';
// =========================

// 1. Carregar posts.js
const postsFilePath = path.join(__dirname, 'posts.js');
if (!fs.existsSync(postsFilePath)) {
  console.error('❌ Arquivo posts.js não encontrado.');
  process.exit(1);
}

let posts;
try {
  const postsModule = new Function(fs.readFileSync(postsFilePath, 'utf8') + '; return posts;');
  posts = postsModule();
} catch (e) {
  console.error('❌ Erro ao interpretar posts.js:', e.message);
  process.exit(1);
}

if (!Array.isArray(posts) || posts.length === 0) {
  console.error('❌ posts.js não contém um array de posts válido.');
  process.exit(1);
}

// 2. Criar pasta de saída
const outDir = path.join(__dirname, 'posts');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// 3. Template do post
const templatePath = path.join(__dirname, 'post-template.html');
if (!fs.existsSync(templatePath)) {
  console.error('❌ post-template.html não encontrado.');
  process.exit(1);
}
const template = fs.readFileSync(templatePath, 'utf8');

// 4. Ordenar posts
const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

// 5. Gerar páginas de posts (usando slug)
sortedPosts.forEach(post => {
  const slug = post.slug || post.id.toString();   // fallback para id
  const firstParagraph = post.content.split('\n\n')[0] || '';
  const description = firstParagraph.replace(/\n/g, ' ').trim().substring(0, 160);
  const formattedDate = new Date(post.date).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const contentHTML = convertContent(post.content);
  const canonical = `${BASE_URL}/posts/${slug}.html`;

  let page = template
    .replace(/\{\{TITLE\}\}/g, escapeHTML(post.title))
    .replace(/\{\{DESCRIPTION\}\}/g, escapeHTML(description))
    .replace(/\{\{DATE\}\}/g, post.date)
    .replace(/\{\{DATE_FORMATTED\}\}/g, formattedDate)
    .replace(/\{\{CONTENT_HTML\}\}/g, contentHTML)
    .replace(/\{\{CANONICAL_URL\}\}/g, canonical);

  fs.writeFileSync(path.join(outDir, `${slug}.html`), page, 'utf8');
  console.log(`✅ ${slug}.html gerado`);
});

// 6. Gerar index.html
console.log('🔄 Gerando index.html...');
const latestPost = sortedPosts[0];
const latestSlug = latestPost.slug || latestPost.id;

const olderPostsLinks = sortedPosts.slice(1).map(post => {
  const slug = post.slug || post.id;
  return `                    <li><a href="posts/${slug}.html">${escapeHTML(post.title)} — ${formatDate(post.date)}</a></li>`;
}).join('\n');

const indexHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>fotografia bélica – o momento exato da ação</title>
  <meta name="description" content="A fotografia é bélica. O cotidiano não deixa margem para erros.">
  <meta property="og:title" content="fotografia bélica">
  <meta property="og:description" content="O momento exato da ação. Textos e ensaios sobre a vivência fotográfica, uma câmera e seus olhares.">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="fotografia bélica">
  <link rel="canonical" href="${BASE_URL}/index.html">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background-color: #fafaf8;
      color: #2c2c2c;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 5vw;
      min-height: 100vh;
    }
    header { text-align: center; margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; font-weight: 400; letter-spacing: 2px; color: #1a1a1a; text-transform: lowercase; margin-bottom: 0.2rem; }
    .subtitle { font-size: 2.5rem; font-weight: 200; color: #1a1a1a; letter-spacing: 1px; margin-top: 0; }
    main { width: 100%; max-width: 650px; display: flex; flex-direction: column; align-items: center; }
    .post-card {
      background: white; border: 1px solid #eae6e0; border-radius: 4px;
      padding: 2.5rem 2rem; margin-bottom: 3rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04); width: 100%;
    }
    .post-card h2 { font-size: 1.8rem; font-weight: 400; margin-bottom: 1rem; color: #1a1a1a; text-align: center; line-height: 1.3; }
    .post-card h2 a { color: inherit; text-decoration: none; border-bottom: 1px dotted #aaa; transition: border-color 0.2s; }
    .post-card h2 a:hover { border-bottom-color: #1a1a1a; }
    .post-card .post-date { text-align: center; font-size: 0.9rem; color: #8c8c8c; margin-bottom: 2rem; letter-spacing: 0.5px; }
    .post-card .post-content { font-size: 1.1rem; text-align: left; }
    .post-card .post-content p { margin-bottom: 1rem; }
    .older-posts { width: 100%; max-width: 650px; margin-top: 1rem; }
    .older-posts h3 { font-weight: 400; font-size: 1.2rem; color: #4a4a4a; margin-bottom: 1rem; text-align: center; }
    .posts-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; align-items: center; }
    .posts-list li { font-size: 0.95rem; }
    .posts-list a { color: #555; text-decoration: none; border-bottom: 1px dotted #ccc; transition: color 0.2s, border-color 0.2s; }
    .posts-list a:hover { color: #1a1a1a; border-bottom-color: #1a1a1a; }
    footer { margin-top: auto; padding-top: 3rem; font-size: 0.8rem; color: #aaa; }
    @media (max-width: 600px) {
      body { padding: 1.5rem 3vw; }
      h1 { font-size: 2rem; }
      .subtitle { font-size: 2rem; }
      .post-card {
        padding: 2.2rem 1rem;
        border-radius: 0;
        border-left: none;
        border-right: none;
        box-shadow: none;
      }
      .post-card h2 { font-size: 1.5rem; }
      .post-card .post-content { font-size: 1rem; }
    }
  </style>
</head>
<body>
  <header>
    <h1>fotografia bélica</h1>
    <p class="subtitle">O momento exato da ação</p>
  </header>
  <main>
    <div class="post-card">
      <h2><a href="posts/${latestSlug}.html">${escapeHTML(latestPost.title)}</a></h2>
      <div class="post-date">${formatDate(latestPost.date)}</div>
      <div class="post-content">
        ${convertContent(latestPost.content)}
      </div>
    </div>
  </main>
  <section class="older-posts">
    <h3>textos anteriores</h3>
    <ul class="posts-list">
${olderPostsLinks}
    </ul>
  </section>
  <footer>
    <span>© 2026 · fotografia bélica</span>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHTML, 'utf8');
console.log('✅ index.html atualizado.');

// 7. robots.txt
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
console.log('✅ robots.txt gerado.');

// 8. sitemap.xml
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/index.html</loc>
    <lastmod>${latestPost.date}</lastmod>
    <priority>0.8</priority>
  </url>`;
sortedPosts.forEach(post => {
  const slug = post.slug || post.id;
  sitemap += `
  <url>
    <loc>${BASE_URL}/posts/${slug}.html</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.5</priority>
  </url>`;
});
sitemap += '\n</urlset>';
fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
console.log('✅ sitemap.xml gerado.');

console.log('🛠️ Build concluído. Abra index.html para ver o blog.');

// ===== Funções auxiliares =====
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function convertContent(content) {
  if (!content) return '';
  return content
    .split(/\n\n+/)
    .map(p => {
      const trimmed = p.trim();
      if (/^!\[.*\]\(.+\)$/.test(trimmed)) {
        const match = trimmed.match(/!\[(.*)\]\((.+)\)/);
        return `<img src="${match[2]}" alt="${match[1]}" loading="lazy">`;
      }
      return `<p>${escapeHTML(p)}</p>`;
    })
    .join('');
}