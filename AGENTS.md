# fotografia-belica-blog

Blog estático minimalista. Sem build tooling, sem npm. Scripts vanilla Node.js.

## Comandos

```bash
node novo-post.js    # assistente interativo para adicionar post
node build.js        # gera posts/<slug>.html, index.html, robots.txt, sitemap.xml
```

## Publicar um post

1. Adicionar entrada no array `posts` em `posts.js` com os campos: `id` (int), `title`, `date` (AAAA-MM-DD), `content` (parágrafos separados por `\n\n`), `slug` (string única, sem espaços/tradução).
2. `node build.js`
3. Commit e push (GitHub Pages — domínio personalizado em `CNAME`).

## Convenções

- **Slug obrigatório** — sem slug o build usa `id` numérico (evitar).
- **Conteúdo em texto puro** — sem markdown. Parágrafos separados por linha em branco. Imagens: `![alt](url)` em parágrafo próprio.
- **BASE_URL** hardcoded em `build.js:5`, trocar antes do build se o domínio mudar.
- **index.html, posts/*.html, robots.txt, sitemap.xml** são gerados — editar `build.js` ou `post-template.html` em vez deles.
- **`post.html`** é SPA legado (não gerado pelo build, não usar).
- **`posts/1.html`, `posts/3.html`** — resíduos de antes dos slugs, ignorar.
- **`contato.html`** — página estática manual (não gerada pelo build).

## Estrutura

- `posts.js` — única fonte de dados (array de posts).
- `post-template.html` — template com placeholders `{{TITLE}}`, `{{DESCRIPTION}}`, `{{DATE}}`, `{{DATE_FORMATTED}}`, `{{CONTENT_HTML}}`, `{{CANONICAL_URL}}`.
- `build.js` — lê `posts.js`, aplica template, gera páginas estáticas.

## Hospedagem

GitHub Pages + domínio `fotografiabelica.com.br` (`CNAME`). Sem subdiretório — caminhos relativos diretos (`posts/<slug>.html`, `index.html`).
