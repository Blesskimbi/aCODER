// Fetch all documentation from hamishfromatech/A-Coder and hamishfromatech/a-coder-cli
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOC_FILES = [
  // A-Coder IDE
  { id: 'introduction', title: 'Introduction', section: 'Get Started', repo: 'A-Coder', path: 'README.md' },
  { id: 'getting-started', title: 'Getting Started', section: 'Get Started', repo: 'A-Coder', path: 'docs/user-guide/getting-started.md' },
  { id: 'interface-tour', title: 'Interface Tour', section: 'Get Started', repo: 'A-Coder', path: 'docs/user-guide/interface-tour.md' },
  { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts', section: 'Get Started', repo: 'A-Coder', path: 'docs/user-guide/keyboard-shortcuts.md' },
  
  // Chat & Modes
  { id: 'chat-modes', title: 'Chat Modes Overview', section: 'Chat & Modes', repo: 'A-Coder', path: 'docs/user-guide/chat-modes.md' },
  { id: 'learn-mode', title: 'Learn Mode & Tutor', section: 'Chat & Modes', repo: 'A-Coder', path: 'docs/user-guide/learn-mode.md' },
  { id: 'proactive-coach', title: 'Proactive Coach', section: 'Chat & Modes', repo: 'A-Coder', path: 'docs/user-guide/proactive-coach.md' },
  
  // Editing & Code
  { id: 'autocomplete', title: 'Autocomplete (FIM)', section: 'Editing & Code', repo: 'A-Coder', path: 'docs/user-guide/autocomplete.md' },
  { id: 'quick-edit', title: 'Quick Edit (Ctrl+K)', section: 'Editing & Code', repo: 'A-Coder', path: 'docs/user-guide/quick-edit.md' },
  { id: 'inline-diffs', title: 'Inline Diffs & Fast Apply', section: 'Editing & Code', repo: 'A-Coder', path: 'docs/user-guide/inline-diffs.md' },
  { id: 'built-in-tools', title: 'Built-in Tool Catalog', section: 'Editing & Code', repo: 'A-Coder', path: 'docs/user-guide/tools.md' },
  { id: 'tool-approval-and-terminal', title: 'Tool Approval & Terminal', section: 'Editing & Code', repo: 'A-Coder', path: 'docs/user-guide/tool-approval-and-terminal.md' },
  
  // Models & Context
  { id: 'providers-and-models', title: 'Providers & Models', section: 'Models & Context', repo: 'A-Coder', path: 'docs/user-guide/providers-and-models.md' },
  { id: 'context-management', title: 'Context Management & TOON', section: 'Models & Context', repo: 'A-Coder', path: 'docs/user-guide/context-management.md' },
  { id: 'toon-implementation', title: 'TOON Compression Deep Dive', section: 'Models & Context', repo: 'A-Coder', path: 'docs/TOON_IMPLEMENTATION.md' },
  { id: 'settings-reference', title: 'Settings Reference', section: 'Models & Context', repo: 'A-Coder', path: 'docs/user-guide/settings-reference.md' },

  // Integrations
  { id: 'mcp', title: 'Model Context Protocol (MCP)', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/mcp.md' },
  { id: 'acp', title: 'ACP Agents', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/acp.md' },
  { id: 'skills', title: 'Skills System', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/skills.md' },
  { id: 'morph', title: 'Morph AI Fast Context', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/morph.md' },
  { id: 'composio', title: 'Composio Integrations', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/composio.md' },
  { id: 'agent-manager', title: 'Subagents & Agent Manager', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/agent-manager.md' },
  { id: 'mobile-api', title: 'Mobile API & Remote', section: 'Integrations', repo: 'A-Coder', path: 'docs/user-guide/mobile-api.md' },

  // Multimodal & Git
  { id: 'vision', title: 'Vision & UI Debugging', section: 'Multimodal & SCM', repo: 'A-Coder', path: 'docs/user-guide/vision.md' },
  { id: 'media-generation', title: 'Media Generation', section: 'Multimodal & SCM', repo: 'A-Coder', path: 'docs/user-guide/media-generation.md' },
  { id: 'voice', title: 'Voice & Speech', section: 'Multimodal & SCM', repo: 'A-Coder', path: 'docs/user-guide/voice.md' },
  { id: 'git-and-scm', title: 'Git & SCM Workflows', section: 'Multimodal & SCM', repo: 'A-Coder', path: 'docs/user-guide/git-and-scm.md' },

  // A-Coder CLI
  { id: 'cli-overview', title: 'CLI Agent Overview', section: 'CLI Agent', repo: 'a-coder-cli', path: 'README.md' },
  { id: 'cli-usage', title: 'CLI Usage & Commands', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/usage.md' },
  { id: 'cli-reference', title: 'CLI Command Line Flags', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/cli.md' },
  { id: 'cli-extensions', title: 'CLI Extensions API', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/extensions.md' },
  { id: 'cli-skills', title: 'CLI Skills', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/skills.md' },
  { id: 'cli-rpc', title: 'CLI JSON-RPC Protocol', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/rpc.md' },
  { id: 'cli-sdk', title: 'TypeScript SDK', section: 'CLI Agent', repo: 'a-coder-cli', path: 'packages/coding-agent/docs/sdk.md' },

  // Architecture & Contributing
  { id: 'codebase-guide', title: 'Architecture Overview', section: 'Architecture', repo: 'A-Coder', path: 'docs/VOID_CODEBASE_GUIDE.md' },
  { id: 'development-guide', title: 'Development Guide', section: 'Architecture', repo: 'A-Coder', path: 'docs/DEVELOPMENT_GUIDE.md' },
  { id: 'contributing-guide', title: 'Contributing Guidelines', section: 'Architecture', repo: 'A-Coder', path: 'docs/HOW_TO_CONTRIBUTE.md' },
  { id: 'tool-architecture', title: 'Tool Architecture Internals', section: 'Architecture', repo: 'A-Coder', path: 'docs/TOOL_ARCHITECTURE.md' }
];

async function main() {
  console.log(`Starting fetch of ${DOC_FILES.length} documentation files...`);
  const results = [];

  for (const doc of DOC_FILES) {
    const rawUrl = `https://raw.githubusercontent.com/hamishfromatech/${doc.repo}/main/${doc.path}`;
    try {
      const res = await fetch(rawUrl);
      if (!res.ok) {
        console.warn(`Failed ${res.status}: ${rawUrl}`);
        continue;
      }
      const rawText = await res.text();
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{FE0E}\u{FE0F}\u{200D}]/gu;
      const cleanText = rawText
        .replace(emojiRegex, '')
        .replace(/(^#{1,6})\s+/gm, (m, h) => h + ' ')
        .replace(/  +/g, ' ');

      results.push({
        id: doc.id,
        title: doc.title.replace(emojiRegex, '').trim(),
        section: doc.section,
        repo: doc.repo,
        path: doc.path,
        content: cleanText
      });
      console.log(`✓ Fetched [${doc.repo}] ${doc.path} (${rawText.length} bytes)`);
    } catch (err) {
      console.error(`Error fetching ${rawUrl}:`, err.message);
    }
  }

  const outDir = path.resolve(__dirname, '../src/content/docs-data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'docs.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Saved ${results.length} docs to ${outFile}`);
}

main().catch(console.error);
