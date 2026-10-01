# PRODUCT_NOTES.md — A-Coder IDE

**Single source of truth for all site copy.** Everything here is sourced from `hamishfromatech/A-Coder` (read 30 Sep 2026). Anything not in this document does not go on the site.

Sources read: `README.md`, `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, `PLAN-modernize-sidebar-chat.md`, `.voidrules`, `product.json`, `package.json`, `LICENSE.txt`, `install.sh`, `install.ps1`, `docs/README.md`, `docs/SUMMARY.md`, `docs/release-notes.md`, `docs/TOON_IMPLEMENTATION.md`, `docs/student-mode-plan.md`, the GitHub Releases API and the repo metadata API.

---

## 1. Identity

| | |
|---|---|
| **Name** | A-Coder IDE (`nameShort` and `nameLong` in `product.json`) |
| **Repo description** | "Your True Open Source AI IDE" |
| **README tagline** | "Where Agentic AI Meets Professional Development" |
| **README positioning** | "Next-generation AI-native code editor built for developers who demand more from their tools." |
| **Built on** | VS Code / Code-OSS, forked from **Void Editor** |
| **Licence** | **Apache-2.0** (`LICENSE.txt`; GitHub reports `Apache-2.0`) — ⚠️ see §9 |
| **Application name** | `a-coder` · data folder `.a-coder` · URL protocol `acoder://` |
| **Bundle ID** | `com.acodereditor.code` · Linux icon `a-coder-editor` |
| **Primary language** | TypeScript |
| **Topics** | ai, ide, llamacpp, llm, ollama, vllm, vscode |

### Live repo metrics (fetch at build time, ISR hourly)

As at 30 Sep 2026: **37 stars**, **3 forks**, 0 open issues, created 28 Aug 2025, last push 25 Sep 2026.

These are small, honest numbers. **Do not use them as social proof** ("join thousands of developers"). Render them as a plain, factual `★ 37` GitHub pill in the nav and a live stats row in the open-source section. Fall back to the last-known values if the API fails.

---

## 2. The four modes

`README.md` names them **Chat · Plan · Agent · Learn**. `docs/README.md` names the third **Code**. ⚠️ See §9.

| Mode | README description | docs/README "use when" |
|---|---|---|
| 💬 **Chat** | General coding questions, quick fixes | Quick questions, no file access |
| 🔍 **Plan** | Understanding codebases, architectural decisions | Research & scope before editing |
| 🤖 **Agent** *(docs: Code)* | Multi-step features, complex refactoring | Actually change code, run commands |
| 🎓 **Learn** | Skill building, concept explanations, exercises | Get tutored, practice, quiz yourself |

---

## 3. Features (verified)

### Editing & code
- **Autocomplete** — inline FIM (fill-in-the-middle) completions. `AutocompleteService`. Accept with `Tab`.
- **Quick Edit (`Ctrl+K`)** — inline AI editing in the editor buffer. `EditCodeService`.
- **Inline diffs** — diff zones, apply / reject, auto-accept, **Fast Apply**.
- **Exact-match edits** — v1.6.8 simplified the edit tool "to exact matching only for more reliable code edits".
- **Built-in tool catalogue** — read, edit, search, structure management, terminal.
- **Tool approval & terminal** — approval categories, auto-approve, terminal allow/deny patterns.
- **Semantic codebase search** — `ContextGatheringService`; **Morph Fast Context**.
- **Multiple threads** — `ChatThreadService`. `Ctrl+Shift+L` opens a new chat.

### Context
- **TOON compression** (Token-Oriented Object Notation) — compresses tool results.
  - Setting: `enableToolResultTOON`, **default `false`** (opt-in). ⚠️ See §9.
  - Only applied when it saves ≥10%.
  - Measured savings: **directory listings 30–50%**, **lint errors 40–60%**, **large structured MCP results 30–70%**.
- **Rolling window + summarisation** — `ContextCompressionService`.
- **Agent iteration cap**, context gathering — `docs/user-guide/context-management.md`.

### Terminal, git & repo
- Run commands, monitor status, auto-recovery.
- **AI commit messages**, repo tools, semantic repo search.

### Integrations
- **MCP** (Model Context Protocol) — `MCPService`.
- **ACP** (Agent Communication Protocol) agent servers.
- **Skills** — markdown skill packages in `~/.a-coder/skills/`, with execution, evaluation and a marketplace (v1.6.0).
- **Morph** — Fast Context, Fast Apply, Repo Storage.
- **Composio** — 1000+ app integrations, plus triggers and webhooks (official `@composio/core` SDK as of v1.7.0).
- **Subagents & Agent Manager** — focused delegations, multi-workspace orchestration. `Ctrl+Shift+A`.
- **Mobile API** — REST + WebSocket remote control.
- **Chrome DevTools MCP** — browser tools via the Chrome DevTools Protocol (v1.6.8).

### Multimodal
- **Vision** — image understanding from chat.
- **Media generation** — image and video generation tools.
- **Voice & audio** — speech-to-text and text-to-speech.

### Learn / Student Mode
- Levels, exercises, hints, quizzes, badges, streaks.
- **Proactive Coach** — ambient coaching suggestions while you work (Settings UI shipped v1.7.0).
- Mermaid diagrams render in chat markdown (v1.6.5).
- Fill-in-the-blank component; multiple quiz question types and lesson test cases.

### Extensions
`product.json` points `extensionsGallery` at the **Microsoft VS Code Marketplace** (`marketplace.visualstudio.com`). ⚠️ Not Open VSX — see §9.

---

## 4. Keyboard shortcuts (verified, `docs/README.md`)

| Shortcut | Action |
|---|---|
| `Ctrl+K` | Quick Edit |
| `Ctrl+L` | Add selection to chat |
| `Ctrl+Shift+L` | New chat |
| `Ctrl+Shift+A` | Open Agent Manager |
| `Tab` | Accept autocomplete |

⚠️ `Ctrl+L` is **"add selection to chat"**, not "open chat sidebar" — see §9.

---

## 5. Providers

**Cloud (11):** Anthropic · OpenAI · Google Gemini · xAI Grok · Mistral · Groq · DeepSeek · OpenRouter · Google Vertex AI · Azure · AWS Bedrock

**Local / self-hosted (5 + 2):** Ollama · vLLM · LM Studio · LiteLLM · any OpenAI-compatible server · **llamaCpp** (added v1.6.8) · **OpenAdapter** (flat-rate provider, v1.6.8)

Capability mapping lives in `common/modelCapabilities.ts`.

**Do not name specific third-party model versions on the site** (the `.md` brief lists "Claude 3.7 Sonnet", "GPT-4o", "o3-mini", "Gemini 2.0" — none of these are stated in the repo, and version claims date badly). Name **providers**, not model SKUs.

### Adding a model (verified flow)
1. Settings → Manage Models → pick a provider
2. Cloud: paste your API key. Local: confirm the endpoint (auto-filled); models auto-detect
3. Enable the models you want, then assign them to features in Settings → Features

Per-feature model selection, capability and reasoning overrides are all supported.

---

## 6. Privacy & architecture

- **Direct-to-provider.** `SendLLMMessageService` dispatches from the user's machine to the provider. No A-Coder relay or proxy.
- **Bring your own key**, or run entirely local via Ollama / vLLM / LM Studio / LiteLLM / llamaCpp.
- **Per-tool permissions** — approval categories, auto-approve settings, terminal allow/deny patterns.
- `linkProtectionTrustedDomains` is limited to the A-Coder repo and `ollama.com`.

> ⚠️ **"Zero retention" / "zero telemetry" needs your confirmation before it goes on the site.** The repo shows direct-to-provider dispatch and local-model support, which supports "your keys, your machine, no A-Coder middleman". It does **not** contain a published privacy policy or telemetry audit, and `docs/TOON_IMPLEMENTATION.md` lists "Metrics: track actual token savings in telemetry" as *future work*. Inherited VS Code telemetry settings have not been verified. I will write the architectural claim (no intermediary server) and **not** an absolute zero-telemetry claim unless you confirm it.

---

## 7. Install & download

**macOS / Linux**
```
curl -fsSL https://raw.githubusercontent.com/hamishfromatech/A-Coder/main/install.sh | bash
```

**Windows**
```
irm https://raw.githubusercontent.com/hamishfromatech/A-Coder/main/install.ps1 | iex
```

**Installers:** `https://github.com/hamishfromatech/A-Coder/releases` (`downloadUrl` in `product.json`)

### Latest release (live at build time)
Tag **`1.99.30100`**, titled **"1.9.15"**, published 25 Sep 2026, **57 assets**.

Release tags use the VS Code base version (`1.99.3xxxx`); release *titles* use the A-Coder version (`1.9.15`). `product.json` carries `voidVersion 1.9.13` / `voidRelease 0098`, which trails the latest release. **Display the release title, not the tag.**

**Platform artefacts — verified against the live release (57 assets, 18 installable).**

| Platform | Preferred | Also published |
|---|---|---|
| macOS Apple Silicon | `A-Coder.arm64.<v>.dmg` | `A-Coder-darwin-arm64-<v>.zip` |
| macOS Intel | `A-Coder.x64.<v>.dmg` | `A-Coder-darwin-x64-<v>.zip` |
| Windows ARM64 | `A-CoderSetup-arm64-<v>.exe` | `A-CoderUserSetup-arm64-<v>.exe`, `A-Coder-win32-arm64-<v>.zip` |
| **Windows x64** | **— none —** | ⚠️ see below |
| Linux x86_64 | `a-coder_<v>_amd64.deb` | `…glibc2.30-x86_64.AppImage`, `A-Coder-linux-x64-<v>.tar.gz` |
| Linux ARM64 | `a-coder_<v>_arm64.deb` | `A-Coder-linux-arm64-<v>.tar.gz` |
| Linux ARMHF | — | `a-coder_<v>_armhf.deb`, `A-Coder-linux-armhf-<v>.tar.gz` |

Every artefact ships `.sha1` and `.sha256` companions → the `/download` page has a real **integrity & checksums** section.

`reh` and `reh-web` artefacts are **remote extension-host server builds, not the desktop app** — the download page filters them out.

> ⚠️ **There is no Windows x64 build in release 1.9.15.** Only `arm64` Windows artefacts are published, yet x64 is the overwhelming majority of Windows machines. The download page shows "Not in this release" for that card rather than mislabelling an arm64 binary. **This looks like a release-pipeline gap worth fixing in the repo** — please confirm whether it is intentional.
>
> *Correction to an earlier note in this file:* I initially recorded that macOS ships `.zip` rather than `.dmg` and that the `.md` brief was wrong about `.dmg`/`.deb`. Having enumerated all 57 assets, **both `.dmg` and `.deb` are in fact published** — the brief was right and my earlier note was based on a truncated asset listing. The site prefers `.dmg` on macOS and `.deb` on Linux, with the other formats offered as alternates. Assets are still enumerated from the API at build time rather than hard-coded.

### Requirements
Node.js v22 for building from source (`.nvmrc`). End-user system requirements are **not stated in the repo** — needed for the FAQ (see §10).

---

## 8. Migration

README and the brief cite one-click import from **VS Code, Cursor and Windsurf**. VS Code compatibility is well evidenced (Code-OSS base, VS Code Marketplace gallery). The specific Cursor and Windsurf import paths are **not documented in the files read** — I will describe VS Code import concretely and keep Cursor / Windsurf to a single unelaborated line unless you point me at the source.

---

## 9. ⚠️ Conflicts and corrections — please confirm

These are contradictions **inside the repo**, or between the repo and the `.md` brief. Listed most consequential first.

1. **Licence: Apache-2.0 vs MIT.** `LICENSE.txt` is Apache-2.0 and GitHub reports Apache-2.0, but `product.json` sets `"licenseName": "MIT"` and `package.json` (inherited from `code-oss-dev`) says MIT. **I will publish Apache-2.0.** The `product.json` field looks like an unchanged Void/VS Code leftover and is worth fixing in the repo.

2. **Third mode: "Agent" or "Code"?** `README.md` says Agent; `docs/README.md` says Code. **I will use Agent** (it matches the brief, `AGENTS.md` and the Agent Manager naming) — confirm.

3. **TOON is off by default.** `enableToolResultTOON` defaults to `false`. The brief presents TOON as a headline capability. **I will present it as an opt-in setting** with its real measured ranges, not as an always-on 30–70% saving.

4. **Extensions gallery is the VS Code Marketplace**, not Open VSX as the `.md` spec claims. I will say "VS Code extensions, themes and profiles" and not name Open VSX.

5. **`Ctrl+L` is "add selection to chat"**, not "open the chat sidebar" as the `.md` spec states.

6. **Zero telemetry / zero retention** — unverified. See §6.

7. **`docs/release-notes.md` is stale** — it stops at v1.7.0 (Apr 2026) while GitHub Releases run to 1.9.15 (Sep 2026). **`/changelog` will use the Releases API** as the primary source, with the MDX file as supplementary.

8. **The `.md` spec's "A-Coder CLI" / Pi engine is not in this repo.** `a_coder_saas_master_engineering_design_spec_prompt.md` specifies a second product — a terminal agent forked from `@earendil-works/pi-coding-agent`, at `hamishfromatech/a-coder-cli`, with `npm install -g @a-coder/cli` and `a-coder.dev`. **None of that is verifiable from the A-Coder repo**, which does contain a `cli/` directory (the standard VS Code CLI). The repo has no `a-coder.dev` homepage (its homepage field points to a Skool community). **I have not built `/cli`, `/desktop` or `/models` pages around unverified claims** — see the plan. Give me the CLI repo and I will add them.

9. **No pricing exists.** Free and open source, bring your own key. `/pricing` will say exactly that, with a clearly marked `TODO` component and nothing invented.

---

## 10. Gaps I need from you

- Real IDE screenshots (see `public/screenshots/README.md`, to be written in Phase 3)
- Confirmation on the licence, mode naming and telemetry claims above
- End-user system requirements (RAM, OS versions) for the FAQ
- The `a-coder-cli` repo, if the CLI pages are in scope
- Real testimonials, or leave the section behind `SHOW_TESTIMONIALS=false`
- Domain and analytics decisions

---

## 11. Brand carry-over from `DESIGN.md`

`DESIGN.md` is the IDE's own UI modernisation guide, so the site must match it for product and site to read as one brand.

- **Accent: a muted teal.** `--void-accent-primary: oklch(0.7 0.12 195)` ≈ **`#00B5B5`**; secondary `oklch(0.65 0.08 250)` ≈ `#6993BE`.
- **It explicitly rejects** the "purple/blue AI gradient" aesthetic and `#6366f1` as "too vibrant for an IDE context".
- **Fonts:** it names *Geist, Outfit or Satoshi* for sans and *JetBrains Mono / Fira Code / SF Mono* for mono.
- **Radii:** 4 / 8 / 12 / 16 / 24 / full.
- **Type scale:** 11 / 13 / 14 / 15 / 18 / 22 / 28px.
- **Tinted, not black, shadows**; subtle accent glow only.
- **Named techniques:** cursor-following spotlight cards (`radial-gradient(600px circle at var(--mouse-x) var(--mouse-y))`), staggered 60ms fade-up entries, skeleton shimmer, `cubic-bezier(0.34,1.56,0.64,1)` overshoot on toggles, `prefers-reduced-motion` honoured, tabular numerals for counters.

This aligns closely with the reference's own system (see `DESIGN_SPEC.md` §6–7) and is the backbone of identity option **A**.

---

## 12. Logo

`resources/a-coder-transparent-512.png`, `resources/a-coder-1024.png`, `void_icons/a-coder.png`, `a-coder.jpg` (2048×2048).

Verified by inspection: a **brushed-steel triangle of nested concentric triangular frames**, each ring broken into segments with gaps at varying corners, thinning toward a bright open centre, lit from the upper left against a dark smoky ground. This matches the Phase 2 brief and is the source for both the 3D rebuild and the site's visual motif.
