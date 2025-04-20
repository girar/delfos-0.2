<!-- src/routes/about/+page.svelte -->
<svelte:head>
  <title>Delfos‑About</title>
</svelte:head>

<div class="main">
  <section class="about">
    <h2>Technology Stack</h2>

    <ul>
      <li>Frontend Framework: SvelteKit (Svelte v5)</li>
      <li>Languages: HTML, CSS, JavaScript, TypeScript</li>
      <li>Server‑Side API: SvelteKit server endpoints (+server.ts)</li>
      <li>LLM Integration: OpenAI API (official Node library)</li>
      <li>Custom UI & Animations: CSS & drag‑preview JS</li>
      <li>Version Control & Deployment: Git & Vercel</li>
    </ul>

    <p>
      This project was vibe‑coded over roughly three weeks. Before starting
      I’d never built a website or crafted a web UI—my HTML/CSS knowledge
      was minimal and my JavaScript basic. The initial concept: an interactive
      web interface powered by LLM interpretations, using ChatGPT‑4o to
      generate original, visually consistent assets. I began with the
      22 Major Arcana as proof of concept and plan to expand to all 78 cards.
    </p>

    <p>
      Version 0.2 β is the first public release (GPT‑3.5 Turbo back‑end).
      Upcoming work: multiple language versions, prompt‑polish, model upgrade,
      deeper OpenAI integration, UI refinements, and eventually a self‑contained
      web card‑game engine.
    </p>

  </section>
</div>

<style>
  /* container that sits below the fixed header */
  .main {
    width: 100%;
    padding: 2rem;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
  }

  /* centred column */
  .about {
    width: 100%;
    max-width: 35rem; /* ≈ 600 px */
    color: #fff;
    font-family: sans-serif;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .about h2 {
    text-align: center;
    margin: 0 0 1rem;
    font-size: 1.3rem;
  }

  /* list centred, keeps bullets */
  .about ul {
    list-style: disc;
    list-style-position: outside;
    padding-left: 1.25rem;
    margin: 0 auto 0.5rem;
    max-width: 25rem;
    width: 100%;
  }

  .about li {
    margin-bottom: 0.5rem;
  }

  .about p {
    text-align: justify;
    margin: 0;
    max-width: 30rem;
  }

  .about a {
    color: #bbb;
    text-decoration: underline;
  }

  /* mobile tweaks */
  @media (max-width: 35rem) {
    .main {
      padding: 0.75rem;
      margin-top: 3rem; /* extra drop for burger */
    }
    .about {
      gap: 0.75rem;
    }
    .about h2 {
      font-size: 1.4rem;
    }
    .about ul {
      padding-left: 1rem;
      margin-bottom: 0.75rem;
    }
    .about li {
      margin-bottom: 0.4rem;
      line-height: 1.4;
      font-size: 1rem;
    }
    .about p {
      padding: 0 0.5rem;
    }
  }
</style>
