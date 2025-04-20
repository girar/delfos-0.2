<script lang="ts">
  import { onMount } from 'svelte';

  // This component is now located at src/routes/delfos/game/components/ShuffleAnimation.svelte.
  // It receives the deck's backside image from the parent component.
  export let backImage: string;

  // Local flag to toggle display after the animation is complete.
  let show = true;

  onMount(() => {
    // Hide the shuffle animation after 2 seconds (matching the animation duration).
    setTimeout(() => {
      show = false;
    }, 2000);
  });
</script>

{#if show}
  <div class="shuffle-container">
    {#each Array(5) as _, i}
      <img src={backImage} class="card card-{i}" alt="Shuffling Card" />
    {/each}
  </div>
{/if}

<style>
  /* Container fills its parent (the deck wrapper) exactly */
  .shuffle-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  /* Each card covers 100% of the container with correct dimensions and rounded corners */
  .card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.7rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transform-origin: center center; /* Pivot around its center */
    animation: fan 1s ease forwards;
  }

  /* Define a unique rotation angle for each card */
  .card-0 { --angle: -20deg; }
  .card-1 { --angle: -10deg; }
  .card-2 { --angle: 0deg; }
  .card-3 { --angle: 10deg; }
  .card-4 { --angle: 20deg; }

  @keyframes fan {
    0% {
      transform: rotate(0deg);
      opacity: 1;
    }
    50% {
      transform: rotate(var(--angle));
      opacity: 1;
    }
    100% {
      transform: rotate(0deg);
      opacity: 0;
    }
  }
</style>
