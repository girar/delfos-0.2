<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  // fingerprinted at build‑time
  import bannerImage from '$lib/assets/delfos_banner2.png';

  /* ── props ───────────────────────────── */
  export let dialogMessage  = 'What would you like to know about, dear Anon?';
  export let inputDisabled  = false;
  export let feedbackMessage = '';
  // NEW: controls spinner visibility
  export let loading: boolean = false;

  /* ── typed dispatcher ────────────────── */
  const dispatch = createEventDispatcher<{ submit: string }>();

  /* ── local state ─────────────────────── */
  let userInput = '';
  const maxChars = 140;

  $: 
  // when it's time for the follow‑up question, clear the box
  if (feedbackMessage === 'You may ask a different question') {
    userInput = '';
  }

  /* ── helpers ─────────────────────────── */
  function handleSubmit() {
    if (feedbackMessage !== 'You may ask a different question') {
      const trimmed = userInput.trim();
      if (!trimmed || trimmed.length > maxChars) return;
    }
    dispatch('submit', userInput.trim());
  }

  function autoResize(e: Event) {
    const ta = e.target as HTMLTextAreaElement;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }
</script>

<style>
  /* bubble */
  .oracle-dialog {
    background: linear-gradient(135deg, rgba(52,52,52,.52), rgba(62,62,62,.51));
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 0.25rem 0.375rem rgba(0,0,0,.3);
    border: 1px solid rgba(255,255,255,.1);
    color: #eee;
    max-width: 31.25rem;   /* 500 px */
    max-height: 56.25rem;  /* 900 px */
    margin: 0 auto;
    animation: fadeIn 1s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  @keyframes fadeIn { from { opacity: 0; transform: scale(.95) } to { opacity: 1 } }

  .oracle-dialog p { margin: .5rem 0; font-size: 1rem; }

  textarea {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    margin: .5rem 0;
    font-size: 1.1rem;
    background: rgba(255,255,255,.62);
    color: #000;
    outline: none;
    text-align: center;
    resize: none;
    overflow: hidden;
    line-height: 1.6;
  }
  textarea::placeholder { color: rgba(24,24,24,.7); }

  button {
    background: #444;
    border: 0.125rem solid #666;
    border-radius: 0.5rem;
    color: #fff;
    font-size: 1rem;
    padding: .6rem .8rem;
    cursor: pointer;
    transition: background .3s ease;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }
  button:hover { background: #555; }

  /* header */
  .dialog-header { width: 100%; }
  .dialog-title  {
    font-family: 'Tektur', sans-serif;
    font-size: 1.4rem;
    margin: 0 0 .1rem;
    line-height: 1;
  }

  /* feedback */
  .feedback {
    font-family: 'Rosarivo', cursive;
    font-size: 1rem;
    color: rgb(225,178,24);
    margin: .5rem 0;
  }

  /* spinner */
  .spinner {
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid #eee;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    animation: spin 1s linear infinite;
    margin: 0.5rem auto;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* LLM frame */
  .dialog-text-frame {
    background: #161616;
    border-radius: 0.75rem;
    padding: .5rem;
    width: 100%;
    height: calc(1.6em * 10);
    line-height: 1.6;
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: #555 #2e2e2e;
  }
  .dialog-text-frame::-webkit-scrollbar {
    width: 6px;
  }
  .dialog-text-frame::-webkit-scrollbar-track {
    background: #2e2e2e;
    border-radius: 0.75rem;
  }
  .dialog-text-frame::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 0.75rem;
  }

  /* banner image – keep aspect ratio */
  .banner-image {
    width: 100%;
    aspect-ratio: 16/9;
    height: auto;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: .5rem;
    object-fit: cover;
  }

  /* mobile adjustments */
  @media (max-width: 40rem) {
    .oracle-dialog { max-width: 100%; padding: 0.75rem 1rem; }
    .dialog-title  { font-size: 1.1rem; }
    button         { font-size: .9rem; }
  }

  /* portrait‑only: move feedback below Submit */
  @media (max-width: 40rem) and (orientation: portrait) {
    .feedback {
      order: 99;
      margin: 0.5rem 0 0;
    }
  }
  
</style>

<div class="oracle-dialog" transition:fade>
  <div class="dialog-header">
    <h2 class="dialog-title">DELFOS – TAROT DIVINATION</h2>
  </div>

  {#if feedbackMessage}
    <p class="feedback">{feedbackMessage}</p>
  {/if}

  <img src={bannerImage} alt="Delfos banner" class="banner-image" />

  <div class="dialog-text-frame">
    {#if loading}
      <div class="spinner"></div>
    {/if}
    <p>{dialogMessage}</p>
  </div>

  <textarea
    bind:value={userInput}
    maxlength={maxChars}
    rows="1"
    placeholder={feedbackMessage === 'You may ask a different question'
      ? 'Enter your query or press submit'
      : 'Enter your query…'}
    disabled={inputDisabled}
    on:input={autoResize}>
  </textarea>

  <button on:click={handleSubmit} disabled={inputDisabled}>Submit</button>
</div>
