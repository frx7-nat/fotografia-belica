const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const perguntar = (pergunta) => new Promise(resolve => readline.question(pergunta, resolve));

(async () => {
  try {
    // 1. Perguntar título e data
    const title = await perguntar('Título: ');
    const date = await perguntar('Data (AAAA-MM-DD): ');

    // 2. Ler o conteúdo (multilinha)
    console.log('Conteúdo (digite \\n\\n para separar parágrafos. Termine com Ctrl+D e Enter):');
    
    const chunks = [];
    process.stdin.on('data', chunk => chunks.push(chunk.toString()));

    // Aguarda o fim da entrada (Ctrl+D)
    await new Promise(resolve => process.stdin.on('end', resolve));
    let content = chunks.join('').trim();

    // Substitui quebras reais de parágrafo por \n\n no formato do arquivo
    // (caso o usuário digite parágrafos separados por duas quebras, mantém a legibilidade)
    content = content.replace(/\n\s*\n/g, '\n\n');

    // 3. Ler o arquivo posts.js atual
    const arquivo = fs.readFileSync('posts.js', 'utf8');

    // 4. Extrair o array de posts com eval (seguro, pois o arquivo é controlado por você)
    const match = arquivo.match(/const posts = (\[[\s\S]*\]);/);
    if (!match) {
      console.error('❌ Formato inesperado do posts.js. Esperado: const posts = [ ... ];');
      process.exit(1);
    }

    const posts = eval(match[1]);  // apenas para recuperar o array

    // 5. Criar novo post com id único
    const newId = Math.max(...posts.map(p => p.id), 0) + 1;
    const newPost = {
      id: newId,
      title,
      date,
      content
    };

    // 6. Adicionar no início (mais recente primeiro)
    posts.unshift(newPost);

    // 7. Gerar o novo conteúdo do arquivo, formatado com indentação
    const newFileContent = `const posts = ${JSON.stringify(posts, null, 2)};\n`;

    // 8. Salvar substituindo o arquivo
    fs.writeFileSync('posts.js', newFileContent, 'utf8');

    console.log(`✅ Post "${title}" adicionado com sucesso!`);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    readline.close();
  }
})();