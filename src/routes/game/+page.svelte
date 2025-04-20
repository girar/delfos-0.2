<script lang="ts">
  import { tick } from 'svelte';
  import OracleDialog        from '$lib/components/OracleDialog.svelte';
  import { DeckCard }        from '$lib/components/DeckCard';
  import { SlotCard }        from '$lib/components/SlotCard';
  import ShuffleAnimation    from '$lib/components/ShuffleAnimation.svelte';
  import { createCustomPreview, updateCustomPreviewPosition, removeCustomPreview } from '$lib/components/dragPreview';

  /* ── Follow‑up / game state ─────────────────── */
  let initialQuestion = '', followUpQuery = '';
  let followUpMode = false;

  let deckCut = false, cutAnim = false;
  let deckCard: DeckCard | null = null;
  let slotCards: (SlotCard | null)[] = [null, null, null, null, null, null];

  /* ── UI / Oracle state ──────────────────────── */
  let dialogMessage   = 'What would you like to know about, dear Anon?';
  let inputDisabled   = false;
  let oraclePrompt    = '';
  let feedbackMessage = '';
  let loading         = false;

  let interpretationBubbles: string[] = ['', '', ''];
  let finalInterpretation = '';

  /* ── Column logic ───────────────────────────── */
  let activeColumn = 1;
  $: allowedSlots = activeColumn === 1 ? [0,3] : activeColumn === 2 ? [1,4] : [2,5];

  let finalOutcome = false, hideDeck = false;

  /* ── Shuffle / cut control ──────────────────── */
  let showShuffle = false, hasShuffled = false;

  /* ── Card assets ────────────────────────────── */
  import backImage from '$lib/assets/cards/back.png?url';
  const faceGlobs = import.meta.glob('$lib/assets/cards/*.png', { eager: true, query: '?url', import: 'default' });
  const faceImages: string[] = Object.values(faceGlobs).filter(u => u !== backImage);

  /* ── Full‑size card modal ───────────────────── */
  let fullImage: string | null = null;
  const openFullSize = (img: string) => (fullImage = img);

  /* ── Helpers ────────────────────────────────── */
  function getRandomCards(arr: string[], n: number) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  }

  /* ── Deck click ─────────────────────────────── */
  function handleDeckClick() {
    if (!oraclePrompt) return;
    if (!hasShuffled) {
      showShuffle = true;
      setTimeout(() => {
        showShuffle = false;
        feedbackMessage = 'Click the Deck to cut';
        hasShuffled = true;
      }, 1200);
    } else if (!deckCut) {
      deckCut   = true;
      cutAnim   = true;
      feedbackMessage = 'Place and flip the first two cards';
      deckCard  = new DeckCard(getRandomCards(faceImages, 6));
      setTimeout(() => (cutAnim = false), 500);
    }
  }

  /* ── Drag‑start (desktop) ───────────────────── */
  async function handleDragStart(e: DragEvent) {
    document.getElementById('custom-drag-ghost')?.remove();
    e.dataTransfer?.clearData();
    e.dataTransfer?.setData('text/plain', '');
    if (!deckCut || !deckCard) return;
    const transparent = new Image();
    transparent.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PWzudwAAAABJRU5ErkJggg==';
    e.dataTransfer!.setDragImage(transparent, 0, 0);
    await createCustomPreview(backImage);
    const move = (m: MouseEvent) => updateCustomPreviewPosition(m.pageX, m.pageY);
    document.addEventListener('mousemove', move);
    e.currentTarget?.addEventListener('dragend', () => {
      removeCustomPreview();
      document.removeEventListener('mousemove', move);
    }, { once: true });
  }

  /* ── Pointer‑down (touch) ───────────────────── */
  async function handlePointerDown(e: PointerEvent) {
    if (e.pointerType !== 'touch' || !deckCut || !deckCard) return;
    e.preventDefault();
    document.getElementById('custom-drag-ghost')?.remove();
    await createCustomPreview(backImage);
    const onMove = (m: PointerEvent) => updateCustomPreviewPosition(m.pageX, m.pageY);
    const onUp   = (u: PointerEvent) => {
      const el = document.elementFromPoint(u.clientX, u.clientY)?.closest<HTMLElement>('.slot');
      if (el) {
        const idx = +el.dataset.idx!;
        if (allowedSlots.includes(idx) && !slotCards[idx] && deckCard!.hasCards()) {
          const face = deckCard!.getCurrentFace();
          if (face) {
            slotCards[idx] = new SlotCard(face);
            slotCards[idx]!.flipped = false;
            deckCard!.drawNextCard();
          }
        }
      }
      removeCustomPreview();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }

  /* ── API helpers ─────────────────────────────── */
  const columnNames = {1:'The Situation', 2:'The Obstacles', 3:'The Outcome'};

  async function interpretColumn(col: number, names: string[]) {
    loading = true;
    try {
      const res = await fetch('/api/interpret', {
        method : 'POST',
        headers: {'Content-Type':'application/json'},
        body   : JSON.stringify({
          userPrompt : oraclePrompt,
          columnIndex: col,
          columnName : columnNames[col],
          cardNames  : names
        })
      });
      return (await res.json()).interpretation as string;
    } catch {
      return 'Interpretation error.';
    } finally {
      loading = false;
    }
  }

  async function finalizeInterpretation() {
    loading = true;
    const combined = `
Initial question: ${initialQuestion}
Follow‑up:        ${followUpQuery}

Interpretation for The Situation: ${interpretationBubbles[0]}
Interpretation for The Obstacles: ${interpretationBubbles[1]}
Interpretation for The Outcome:   ${interpretationBubbles[2]}

Please provide a final summary.
`;
    try {
      const res = await fetch('/api/interpret', {
        method : 'POST',
        headers: {'Content-Type':'application/json'},
        body   : JSON.stringify({ type:'final', userPrompt: combined })
      });
      return (await res.json()).interpretation as string;
    } catch {
      return 'Final interpretation error.';
    } finally {
      loading = false;
    }
  }

  /* ── Oracle submit ───────────────────────────── */
  function handleOracleSubmit(ev: CustomEvent<string>) {
    if (!followUpMode) {
      oraclePrompt    = ev.detail;
      initialQuestion = ev.detail;
      inputDisabled   = true;
      dialogMessage   = "Let's see what the universe has in store for you... 🔮";
      feedbackMessage = 'Click the Deck to shuffle';
    } else {
      followUpQuery   = ev.detail;
      inputDisabled   = true;
      finalOutcome    = true;
      hideDeck        = true;
      feedbackMessage = 'The Oracle will soon enlighten your path';
      finalizeInterpretation().then(summary => {
        dialogMessage   = summary;
        feedbackMessage = 'The Stars have spoken';
      });
    }
  }

  /* ── Card click / slot drop helpers ──────────── */
  function handleCardClick(idx: number) {
    if (!slotCards[idx]) return;

    if (slotCards[idx]!.flipped) {
      openFullSize(slotCards[idx]!.cardImage);
    } else {
      slotCards[idx]!.flipped = true;
      slotCards = [...slotCards];

      if (allowedSlots.every(i => slotCards[i]?.flipped)) {
        const names = allowedSlots.map(i => slotCards[i]!.cardName);

        if (activeColumn < 3) {
          interpretColumn(activeColumn, names).then(res => {
            interpretationBubbles[activeColumn - 1] = res;
            dialogMessage   = res;
            feedbackMessage = 'You can place and flip the next cards';
            activeColumn   += 1;
          });
        } else {
          interpretColumn(activeColumn, names).then(res => {
            interpretationBubbles[2] = res;
            dialogMessage   = res;
            feedbackMessage = 'You may ask a different question';
            inputDisabled   = false;
            followUpMode    = true;
          });
        }
      }
    }
  }

  const handleSlotDragOver = (e: DragEvent) => e.preventDefault();

  function handleSlotDrop(e: DragEvent, idx: number) {
    e.preventDefault();
    if (allowedSlots.includes(idx) && !slotCards[idx] && deckCard?.hasCards()) {
      const face = deckCard.getCurrentFace();
      if (face) {
        slotCards[idx] = new SlotCard(face);
        slotCards[idx]!.flipped = false;
        deckCard.drawNextCard();
      }
    }
  }

  const restartGame = () => window.location.reload();

  /* ── slide‑to‑center calc ─────────────────────── */
  let slotWrapperEl: HTMLDivElement, rightPanelEl: HTMLDivElement;
  let wrapperOffset = 0;
  async function recalcOffset() {
    await tick();
    if (hideDeck && slotWrapperEl && rightPanelEl) {
      const p = rightPanelEl.getBoundingClientRect();
      const w = slotWrapperEl.getBoundingClientRect();
      wrapperOffset = (p.height - w.height) / 2 - (w.top - p.top);
    } else wrapperOffset = 0;
  }
  $: recalcOffset();
</script>

<svelte:head>
  <title>Delfos‑Game</title>
  <style>:global(footer.footer){display:none}</style>
</svelte:head>

<!-- ===================  MARK‑UP  =================== -->
<div class="container">
  <div class="main-content">
    <!-- Oracle Dialog (left) -->
    <div class="left-panel">
      <OracleDialog
        {dialogMessage}
        {inputDisabled}
        {feedbackMessage}
        {loading}
        on:submit={handleOracleSubmit}/>
    </div>

    <!-- Deck & slots (right) -->
    <div class="right-panel" bind:this={rightPanelEl}>
      <div class="deck-area">
        <div class="deck-wrapper {finalOutcome ? 'fade-out' : ''}" class:collapsed={hideDeck}>
          {#if showShuffle}
            <ShuffleAnimation {backImage}/>
          {/if}

          <!-- a11y‑safe deck control -->
          <button
            type="button"
            class="deck-button"
            aria-label="Shuffle or cut the deck"
            on:click={handleDeckClick}
            on:keydown={(e)=>(e.key==='Enter'||e.key===' ')&&handleDeckClick()}>
            <img
              src={backImage}
              alt=""
              class="deck-image"
              class:draggable-enabled={deckCut}
              class:pop-animation={cutAnim}
              draggable={deckCut}
              on:dragstart={handleDragStart}
              on:pointerdown={handlePointerDown}/>
          </button>
        </div>
      </div>

      <div class="slot-wrapper" bind:this={slotWrapperEl} style="transform:translateY({wrapperOffset}px)">
        <div class="slot-titles">
          <div class="slot-title">The Situation</div>
          <div class="slot-title">The Obstacles</div>
          <div class="slot-title">The Outcome</div>
        </div>

        <div class="slots-grid">
          {#each [0,1,2,3,4,5] as _, idx}
            <div
              class="slot {slotCards[idx] ? 'filled' : (deckCut && allowedSlots.includes(idx) ? 'active' : '')}"
              role="button"
              tabindex="0"
              aria-label="Card slot {idx + 1}"
              data-idx={idx}
              on:dragover={handleSlotDragOver}
              on:drop={(e)=>handleSlotDrop(e,idx)}
              on:keydown={(e)=>{
                if((e.key==='Enter'||e.key===' ') && !slotCards[idx] && deckCut){
                  handleSlotDrop(new DragEvent('drop'),idx);
                }
              }}>
              {#if slotCards[idx]}
                <div
                  class="card-container"
                  role="button"
                  tabindex="0"
                  on:click={()=>handleCardClick(idx)}
                  on:keydown={(e)=>(e.key==='Enter'||e.key===' ')&&handleCardClick(idx)}>
                  <div class="card {slotCards[idx].flipped ? 'flipped' : ''}">
                    <img class="card-face" src={slotCards[idx].cardImage} alt="Card face"/>
                    <img class="card-back" src={backImage}              alt="Card back"/>
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        {#if finalOutcome}
          <button class="restart-btn" on:click={restartGame}>Restart</button>
        {/if}
      </div>
    </div>
  </div>
</div>

{#if fullImage}
  <div class="modal" on:click={() => (fullImage = null)}>
    <img src={fullImage} alt="Full‑size card" class="modal-image"/>
  </div>
{/if}

<style>
  /* layout / grid (unchanged) */
  .container{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem}
  .main-content{display:flex;gap:1rem;width:100%;max-width:900px;margin:0 auto 1.5rem}
  .left-panel{flex:1;display:flex;align-items:center;justify-content:center}
  .right-panel{flex:1}

  /* deck */
  .deck-area{text-align:center;margin-bottom:1rem}
  .deck-wrapper{position:relative;width:140px;height:210px;margin:0 auto;transition:opacity .4s,height .4s;margin-bottom .4s;overflow:visible}
  .deck-wrapper.fade-out{opacity:0;pointer-events:none}
  .deck-wrapper.collapsed{height:0;margin-bottom:0;overflow:hidden}
  .deck-button{background:none;border:0;padding:0;cursor:pointer}
  .deck-image{width:140px;height:210px;border-radius:.7rem;box-shadow:0 2px 4px rgba(0,0,0,.3);touch-action:none}
  .draggable-enabled{cursor:grab}.draggable-enabled:active{cursor:grabbing}
  @keyframes pop{0%{transform:scale(1)}30%{transform:scale(1.1)}60%{transform:scale(1)}100%{transform:scale(1)}}
  .pop-animation{animation:pop .5s ease forwards;transform-origin:center}

  /* slots / cards (unchanged) */
  .slot-wrapper{display:flex;flex-direction:column;align-items:center;transition:transform 4s cubic-bezier(0,.5,.5,1)}
  .slot-titles{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;width:100%;max-width:450px;text-align:center;justify-items:center}
  .slot-title{font-size:1rem;color:#fff;font-weight:600;margin-bottom:1rem}
  .slots-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
  .slot{width:140px;height:210px;display:flex;align-items:center;justify-content:center;background:rgba(50,50,51,.86);border-radius:.7rem}
  .slot.active{border:2px solid #aaa;box-sizing:border-box}
  .slot.filled{background:transparent;box-shadow:none}

  .card-container{perspective:1000px;width:140px;height:210px}
  .card{width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d;position:relative;cursor:pointer}
  .card.flipped{transform:rotateY(180deg)}
  .card-face,.card-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:.7rem;box-shadow:0 2px 4px rgba(0,0,0,.3)}
  .card-back{transform:rotateY(0deg)}
  .card-face{transform:rotateY(180deg)}

  .restart-btn{background:#444;border:2px solid #666;border-radius:8px;color:#fff;font-size:1rem;padding:.6rem .8rem;cursor:pointer;transition:background .3s;margin:0 auto;display:block}
  .restart-btn:hover{background:#555}

  .modal{position:fixed;inset:0;margin-top:2rem;background:rgba(0,0,0,.8);display:flex;justify-content:center;align-items:center}
  .modal-image{max-width:80%;max-height:80%;border:5px solid darkgrey;border-radius:1rem}

  /* media queries (unchanged) */
  @media (max-width:30rem){.deck-wrapper,.deck-image,.slot,.card-container{width:100px;height:150px}.slots-grid{gap:.5rem}.slot-title{font-size:.9rem}}
  @media (max-width:50rem){.main-content{flex-direction:column;align-items:center;gap:2rem}.left-panel,.right-panel{width:100%;max-width:26rem}.oracle-container{margin-bottom:1rem}.right-panel{display:flex;flex-direction:column;align-items:center}}
  @media (max-width:50rem) and (orientation:landscape){
    .container{margin-top:0;height:auto;overflow:visible}
    .main-content{flex-direction:row;align-items:flex-start;gap:1rem}
    .left-panel{flex:1 1 33%}
    .oracle-dialog{width:100%;max-height:calc(100vh - 2rem);overflow-y:auto}
    .deck-wrapper,.deck-image{width:100px;height:150px}
    .right-panel{flex:1 1 45%;display:flex;justify-content:center}
    .slot-wrapper{max-width:calc(3*100px + 2*1rem)}
    .slot,.card-container{width:100px;height:150px}
    .slots-grid{gap:1rem}
  }
  @media (orientation:landscape) and (max-height:37.5rem){
    .deck-wrapper,.deck-image,.slot,.card-container{width:100px;height:150px}.slots-grid{gap:.5rem}
  }
</style>
