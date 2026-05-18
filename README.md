# Static Blog

Site estático minimalista focado em leitura. Sem build tools, sem dependências — apenas Node.js vanilla para geração de páginas HTML.

Ideal para guardar textos, ensaios e hospedar projetos com hospedagem gratuita via GitHub Pages.

## Características

- **Zero dependências** — sem npm, sem frameworks, sem bundlers
- **Geração estática** — HTML puro, rápido e otimizado para SEO
- **Modo claro/escuro** — toggle com persistência em localStorage
- **SEO completo** — meta tags Open Graph, Twitter Card, sitemap.xml, robots.txt
- **Google Analytics** — tag gtag.js integrada
- **Domínio personalizado** — suporte a CNAME
- **Assistente de posts** — CLI interativo para criar novos textos

## Estrutura

```
├── build.js              # Gera HTML estático a partir dos posts
├── novo-post.js          # Assistente interativo para criar posts
├── posts.js              # Única fonte de dados (array de posts)
├── post-template.html    # Template com placeholders
├── index.html            # Página principal (gerada)
├── contato.html          # Página estática manual
├── posts/                # Páginas individuais dos posts (geradas)
├── robots.txt            # Gerado pelo build
├── sitemap.xml           # Gerado pelo build
└── CNAME                 # Domínio personalizado
```

## Uso

### Criar um novo post

```bash
node novo-post.js
```

O assistente pede: título, data (AAAA-MM-DD), slug e conteúdo (parágrafos separados por linha em branco).

### Gerar o site

```bash
node build.js
```

Lê `posts.js`, aplica o template e gera:
- `index.html` — página principal com post em destaque e lista de anteriores
- `posts/<slug>.html` — página individual de cada post
- `robots.txt` — para crawlers
- `sitemap.xml` — para indexação

### Publicar

1. Adicionar entrada no array `posts` em `posts.js`
2. Executar `node build.js`
3. Commit e push (GitHub Pages publica automaticamente)

## Convenções

| Item | Detalhe |
|---|---|
| **Slug** | Obrigatório — sem slug o build usa `id` numérico |
| **Conteúdo** | Texto puro, sem markdown. Parágrafos separados por `\n\n` |
| **Imagens** | `![alt](url)` em parágrafo próprio |
| **BASE_URL** | Definido em `build.js:5` — trocar se o domínio mudar |

## Hospedagem

GitHub Pages com domínio personalizado configurado em `CNAME`.

## Licença

MIT
