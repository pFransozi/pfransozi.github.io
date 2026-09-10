const enhanceReorganizationSection = () => {
  const section = document.getElementById('reorganizar-title')?.closest('section');
  const relationMap = section?.querySelector('.relation-map');

  if (!section || !relationMap || section.querySelector('.reorganization-source-table')) return;

  const intro = document.getElementById('reorganizar-title')?.nextElementSibling;
  if (intro) {
    intro.textContent = 'Antes de observar a reorganização, retomemos a tabela inicial. Uma linha reúne informações sobre quatro partes diferentes do domínio. Observe os grupos e compare-os com as relações que vêm em seguida.';
  }

  const sourceTable = document.createElement('div');
  sourceTable.className = 'visual-panel reorganization-source-table';
  sourceTable.innerHTML = `
    <div class="relation-name"><strong>PEDIDOS</strong><span>estrutura original</span></div>
    <table class="relation-table">
      <thead><tr><th>pedido</th><th>data</th><th>cliente</th><th>telefone</th><th>produto</th><th>preço</th><th>quantidade</th></tr></thead>
      <tbody>
        <tr><td>101</td><td>10/08</td><td>Ana</td><td>9991-1111</td><td>Teclado</td><td>120,00</td><td>1</td></tr>
        <tr><td>102</td><td>10/08</td><td>Bruno</td><td>9882-2222</td><td>Mouse</td><td>80,00</td><td>2</td></tr>
        <tr><td>103</td><td>11/08</td><td>Ana</td><td>9991-1111</td><td>Mouse</td><td>80,00</td><td>1</td></tr>
        <tr><td>104</td><td>11/08</td><td>Ana</td><td>9991-1111</td><td>Monitor</td><td>900,00</td><td>1</td></tr>
      </tbody>
    </table>
    <div class="visual-legend">
      <span><b>Pedido</b> número e data</span>
      <span><b>Cliente</b> nome e telefone</span>
      <span><b>Produto</b> nome e preço</span>
      <span><b>Item do pedido</b> quantidade do produto naquele pedido</span>
    </div>
  `;

  relationMap.before(sourceTable);

  const caption = section.querySelector('.relation-map-caption');
  if (caption) {
    caption.textContent = 'Os grupos identificados acima passam a ter estruturas próprias, conectadas por chaves.';
  }
};

const coreScript = document.createElement('script');
coreScript.src = 'script-core.js';
coreScript.onload = enhanceReorganizationSection;
coreScript.onerror = () => console.error('Não foi possível carregar o script principal da página.');
document.head.appendChild(coreScript);
