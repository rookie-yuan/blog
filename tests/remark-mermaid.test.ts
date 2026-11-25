import { describe, expect, it } from 'vitest';
import remarkMermaid from '../src/plugins/remark-mermaid.mjs';

describe('remarkMermaid', () => {
  it('transforms mermaid code blocks into escaped html nodes and preserves non-mermaid blocks', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'code',
          lang: 'mermaid',
          value: 'flowchart LR\n  A["开始 & <输入>"] --> B[\'结束\']',
        },
        {
          type: 'blockquote',
          children: [
            {
              type: 'code',
              lang: 'ts',
              value: 'const x: number = 1;',
            },
          ],
        },
      ],
    };

    const transform = remarkMermaid();
    transform(tree);

    const mermaidNode = tree.children[0] as { type: string; value: string };
    expect(mermaidNode.type).toBe('html');
    expect(mermaidNode.value).toContain('data-mermaid-block');
    expect(mermaidNode.value).toContain('<pre class="mermaid-source" hidden>');
    expect(mermaidNode.value).toContain('A[&quot;开始 &amp; &lt;输入&gt;&quot;] --&gt; B[&#39;结束&#39;]');

    const tsNode = (tree.children[1] as { children: Array<{ type: string; lang: string; value: string }> }).children[0];
    expect(tsNode.type).toBe('code');
    expect(tsNode.lang).toBe('ts');
    expect(tsNode.value).toBe('const x: number = 1;');
  });
});
