const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const perguntar = (pergunta) => new Promise(resolve => rl.question(pergunta, resolve));

(async () => {
  try {
    const title = await perguntar('Título: ');
    if (!title.trim()) {
      console.error('Título não pode ser vazio.');
      process.exit(1);
    }

    const date = await perguntar('Data (AAAA-MM-DD): ');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      console.error('Data deve estar no formato AAAA-MM-DD.');
      process.exit(1);
    }

    const slug = await perguntar('Slug (URL amigável, ex: meu-novo-post): ');
    if (!slug.trim()) {
      console.error('Slug não pode ser vazio.');
      process.exit(1);
    }

    console.log('\nConteúdo (parágrafos separados por linha em branco. Ctrl+D para finalizar):\n');

    const contentLines = [];
    rl.on('line', line => contentLines.push(line));
    await new Promise(resolve => rl.on('close', resolve));

    let content = contentLines.join('\n').trim();
    if (!content) {
      console.error('Conteúdo não pode ser vazio.');
      process.exit(1);
    }
    content = content.replace(/\n\s*\n/g, '\n\n');

    // Atualizar posts.js
    const arquivo = fs.readFileSync('posts.js', 'utf8');
    const match = arquivo.match(/const posts = (\[[\s\S]*\]);/);
    if (!match) {
      console.error('Formato inesperado do posts.js.');
      process.exit(1);
    }

    const posts = eval(match[1]);
    const newId = Math.max(...posts.map(p => p.id), 0) + 1;

    posts.unshift({ id: newId, title: title.trim(), date: date.trim(), slug: slug.trim(), content });

    fs.writeFileSync('posts.js', `const posts = ${JSON.stringify(posts, null, 2)};\n`, 'utf8');

    console.log(`\nPost "${title.trim()}" adicionado em posts.js`);
    console.log('Execute "node build.js" para gerar as páginas.');
  } catch (err) {
    if (err.message !== 'exit') console.error('Erro:', err.message);
  } finally {
    rl.close();
  }
})();
