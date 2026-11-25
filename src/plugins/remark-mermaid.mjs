/**
 * Escape HTML special characters so Mermaid source stays intact inside <pre>.
 */
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function walkTree(node) {
  if (!node || !Array.isArray(node.children)) return;

  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (child && child.type === 'code' && child.lang === 'mermaid') {
      const escaped = escapeHtml(child.value || '');
      node.children[i] = {
        type: 'html',
        value:
          `<div class="mermaid-block" data-mermaid-block>` +
          `<pre class="mermaid-source" hidden>${escaped}</pre>` +
          `<div class="mermaid-render"><p class="font-mono text-xs text-zinc-500">正在渲染流程图...</p></div>` +
          `</div>`,
      };
    } else {
      walkTree(child);
    }
  }
}

export default function remarkMermaid() {
  return (tree) => {
    walkTree(tree);
  };
}
