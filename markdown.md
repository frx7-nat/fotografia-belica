# Relatório de checkpoint – Blog Fotografia Bélica

**Data:** 5 de maio de 2026  
**Objetivo:** Blog estático minimalista com SEO otimizado.

---

## Estrutura atual

fotografia-belica-blog/
├── index.html
├── posts.js
├── post-template.html
├── build.js
├── novo-post.js
└── posts/
    ├── 1.html
    ├── 2.html
    └── 3.html

---

## Descrição dos arquivos

- **posts.js** – Array com os artigos (id, title, date, content)
- **post-template.html** – Template HTML com placeholders
- **build.js** – Script que gera index.html e posts/*.html
- **novo-post.js** – Assistente para adicionar posts via terminal
- **index.html** – Página inicial (gerada, não editar)
- **posts/*.html** – Páginas dos artigos (geradas, não editar)

---

## Fluxo de publicação

ESCREVER → BUILD → PÚBLICO

1. Editar posts.js (ou usar novo-post.js)
2. Rodar `node build.js`
3. Abrir arquivos HTML localmente ou enviar ao servidor

---

## Funcionalidades implementadas

- [x] Design minimalista
- [x] Título e subtítulo personalizados
- [x] Último post em destaque
- [x] Lista de posts anteriores
- [x] Páginas individuais com botão de retorno
- [x] Responsivo para smartphones
- [x] Meta tags SEO (title, description, Open Graph, canonical)
- [x] Script de build robusto

---

## Pendências

1. Substituir URLs canônicas pelo domínio real
2. Criar `robots.txt`
3. Criar `sitemap.xml`
4. Adicionar JSON-LD (dados estruturados)
5. Suporte a imagens (se desejado)
6. Escolher e configurar hospedagem

---

## Comandos essenciais

```bash
node novo-post.js   # adicionar artigo
node build.js       # gerar site estático