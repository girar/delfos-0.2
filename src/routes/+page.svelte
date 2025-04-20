<!-- src/routes/+page.svelte -->
<svelte:head>
  <title>Delfos‑Home</title>
</svelte:head>

<div class="main">
  <!-- Header: Animated Title only -->
  <div class="header">
    <h1 class="delfosText shiny-text">DELFOS ‑ TAROT DIVINATION</h1>
    <p class="header-subtitle">A mystical reading awaits...</p>
  </div>

  <!-- Instructions Section -->
  <div class="instructions">
    <p class="subtitle">How to Begin Your Journey</p>
    <ol>
      <li>
        Pose your query to The‑Oracle. The more complete your sentence, the deeper your reading—then press "Submit" to begin.
      </li>
      <li>
        Tap the top of the Deck to shuffle the cards, stirring the currents of fate.
      </li>
      <li>
        Tap the Deck again to cut the cards, setting the stage for your destiny.
      </li>
      <li>
        Lay out and flip the cards into three columns; after flipping each column, The‑Oracle will read those cards for you. The first column reveals your current situation, the second uncovers the obstacles ahead, and the third illuminates the potential outcome.
      </li>
      <li>
        After all six cards are revealed, feel free to ask a more focused question. The‑Oracle will then provide a comprehensive final reading of your session.
      </li>
    </ol>
  </div>

  <!-- Enter Button moved below instructions -->
  <div class="enter-wrapper">
    <a href="/game" class="play-button">Enter</a>
  </div>

  <!-- About Section with smaller subtitle -->
  <div class="about">
    <p class="subtitle">
      <a href="/about" style="color: inherit; text-decoration: none;">
        About Delfos
      </a>
    </p>
  </div>
</div>

<style>
  .main {
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
    position: relative;
    flex: 1;
  }

  /* Header: Title at the top */
  .header {
    text-align: center;
    margin-top: 2rem;
  }

  /* Animated metal shine on the title */
  .delfosText {
    font-family: "Tektur", sans-serif;
    font-size: 1.5rem;
    margin: 0 0 0.25rem;      /* reduce gap below title */
    position: relative;
    color: rgba(255, 255, 255, 0.3); /* Base metal color */
    overflow: hidden;
  }

  .shiny-text {
    position: relative;
  }

  .shiny-text::before {
    content: "DELFOS ‑ TAROT DIVINATION";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: inherit;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    z-index: 2;
  }

  .shiny-text::after {
    content: "DELFOS ‑ TAROT DIVINATION";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: white; /* Bright shine color */
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
    background-image: linear-gradient(
      120deg,
      transparent 0%,
      transparent 10%,
      white 20%,
      transparent 30%,
      transparent 100%
    );
    background-size: 200% 100%;
    background-repeat: no-repeat;
    background-position: -150% 0;
    animation: shine 3s linear infinite;
  }

  @keyframes shine {
    0% {
      background-position: -50% 0;
    }
    100% {
      background-position: 150% 0;
    }
  }

  /* Subtitle under header */
  .header-subtitle {
    font-family: "Tektur", sans-serif;
    font-size: 0.75rem;
    text-align: center;
    color: white;
    margin: 0;
  }

  /* Instructions Section */
  .instructions {
    max-width: 550px;
    margin: 1rem auto 1rem;
    color: white;
    font-family: sans-serif;
    font-size: 1rem;       /* body text size */
    line-height: 1.6;
  }

  .instructions .subtitle {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.3rem;     /* subtitle size */
  }

  .instructions ol {
    list-style: decimal inside;
    padding-left: 1rem;
  }

  .instructions li {
    margin-bottom: 0.5rem;
  }

  /* Enter button wrapper (centers it) */
  .enter-wrapper {
    text-align: center;
    margin-bottom: 2rem;
  }

  .play-button {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #888;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    margin-top: 1rem;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  .play-button:hover {
    background-color: #bbb;
    box-shadow: 0 4px 10px rgba(86, 85, 85, 0.72);
  }

  /* About Section */
  .about {
    max-width: 550px;
    margin: 0 auto 2rem;
    color: white;
    font-family: sans-serif;
  }

  .about .subtitle {
    text-align: center;
    font-size: 1rem;     /* subtitle size */
  }

  .about a {
    color: inherit;
  }
</style>
