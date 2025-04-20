<script lang="ts">
  // pull in your global stylesheet
  import '../app.css';

</script>

<!-- src/routes/+layout.svelte -->
<svelte:head>
  <!-- …other head tags… -->
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,700;1,400;1,700&family=Tektur:wght@400;700&family=Rosarivo:ital,wght@0,400;1,400&display=swap"
    rel="stylesheet"
  />
</svelte:head>


<div class="stage">
  <slot />
</div>

<style>
  .stage {
    min-height: 100vh;
    background: linear-gradient(180deg, #202020 0%, #1a1a1a 100%);
  }
</style>
