Delfos – Tarot Divination Simulator
Version: v0.2.2 Live Demo: – mindlog.ch/delfos
A self‑contained, SvelteKit‑powered Tarot divination interface, extracted from a larger site and re‑engineered as its own open‑source project. Pose your question to The Oracle, shuffle and cut the cards, lay them in three columns, and receive ritual‑inspired interpretations at each stage—culminating in a concise final synthesis.
🔮 Features
Interactive Tarot Spread – Six‑card reading in three columns: Situation, Obstacles, and Outcome. – Drag‑&‑drop or tap to place and flip cards.
Oracle Dialog – Custom <OracleDialog> component for user prompts, feedback messages, and loading spinner. – Elegant, keyboard‑accessible styling with Tektur font on titles and Rosarivo on feedback.
Shuffle Animation – <ShuffleAnimation> component sparks the ritual of shuffling.
Full‑Size Card Modal – Tap a flipped card to view it large in a modal overlay.
Responsive Layout – Three distinct breakpoints: desktop, mobile‑portrait, and mobile‑landscape. – Natural vertical scrolling on narrow screens; three‑column “stage” on wide landscape.

🛠 Technical Stack
Framework: SvelteKit v5 (TypeScript)
Styling:
Global gradient backgrounds (dark grey & charcoal).
Scoped component CSS with responsive @media rules.
Google Fonts:
Inter as base font
Tektur for headings/titles
Rosarivo for Oracle feedback text
Components & Helpers:
OracleDialog.svelte
DeckCard & SlotCard (TS classes encapsulating deck state)
ShuffleAnimation.svelte
Drag‑preview utilities: createCustomPreview, updateCustomPreviewPosition, removeCustomPreview
Assets:
Card back image + dynamic import of face images via import.meta.glob()
Server‑Side API:
src/routes/api/interpret/+server.ts — POST endpoint to gpt-3.5-turbo via OpenAI Node SDK
System prompt steers the “ancient Tarot Oracle” persona
Build & Deployment:
Adapter‑auto (defaults to static or serverless as needed)
Bundled with Vite (no custom vitePreprocess)
Package Management: pnpm

📁 Project Structure
src/
├─ lib/
│  └─ assets/cards/      # back.png + face images
├─ routes/
│  ├─ +layout.svelte     # global layout, gradient background & font imports
│  ├─ +page.svelte       # Delfos home page
│  ├─ about/
│  │  └─ +page.svelte    # About Delfos
│  ├─ game/
│  │  ├─ +page.svelte    # Main game UI
│  │  └─ components/     
│  │     ├─ OracleDialog.svelte
│  │     ├─ ShuffleAnimation.svelte
│  │     ├─ DeckCard.ts
│  │     ├─ SlotCard.ts
│  │     └─ dragPreview.ts
└─ routes/
   └─ api/interpret/      
      └─ +server.ts       # OpenAI chat‑completion endpoint

🚀 Getting Started
Prerequisites
Node.js ≥ 18
pnpm ≥ 7
OpenAI API key (for full functionality)

# Clone the standalone repo
git clone https://github.com/girar/delfos-0.2.git
cd delfos-0.2

# Install dependencies
pnpm install

# Create a .env file in project root:
echo 'OPENAI_API_KEY=your_api_key_here' > .env

# Run development server
pnpm dev

Browse to http://localhost:5173 and enjoy your Tarot reading.

⚙️ Environment Variables


📦 Build & Deploy

# Build a production bundle
pnpm build

# Preview the production build
pnpm preview

Deploy anywhere SvelteKit supports (static host, Vercel, Netlify, etc.)—no extra configuration needed.

🤝 Contributing
Fork the repo
Create a feature branch:
Commit your changes and push:
Open a Pull Request. We follow conventional commits and semantic versioning.
📝 License
Pending
