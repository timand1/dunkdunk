<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import butterchurn from "butterchurn";
    import butterchurnPresets from "butterchurn-presets";
    import SelectSong from "../Components/AudioControl.svelte";
    import Modal from "../Components/Modal.svelte";
  import type { Preset, Presets } from "../types/common";
  
    let visualizer = null;
    let open: boolean = false
    let audioContext: AudioContext = null;
    let canvas: null | HTMLCanvasElement = null;
    let presets: Presets = {};
    let width: number;
    let height: number;
    let fullscreen: boolean = false;
    let darkCircle: null | Preset = null
    let activePreset;
    let randomizer: boolean = false
    const visualizerInitializer = async () => {
      visualizer.setRendererSize(width, height);
      
      renderFrames();
      await new Promise(resolve => setTimeout(resolve, 500));
    //   randomPresets();
    };
  
    const renderFrames = () => {
      if (visualizer) {
        visualizer.render();
      }
      setTimeout(() => {
        renderFrames();
        resize();
      }, 1000 / 120);
    };
    let randomTimer
    const randomPresets = () => {
      randomizer = true
      let randomPreset = randomProperty(presets);
      activePreset = randomPreset
      
      if (visualizer) {
        visualizer.loadPreset(presets[randomPreset], 0);
      }
      randomTimer = setTimeout(() => {        
        randomPresets();
      }, 15000);
    };

    const stopRandom = () => {
      randomizer = false
      clearTimeout(randomTimer)
    }
  
    const randomProperty = (obj) => {
      const key = Object.keys(obj);
      return key[Math.floor(Math.random() * key.length)];
    };
  
    const resize = () => {
      let newWidth = window.innerWidth
      let newHeight = window.innerHeight
      const total = newWidth + newHeight;
      const oldTotal = width + height;
      if (total !== oldTotal) {
        if (!fullscreen) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          if (visualizer) {
            visualizer.setRendererSize(newWidth, newHeight);
          }
          width = newWidth;
          height = newHeight;
        }
      }
    };
  
    onMount(() => {
      presets = butterchurnPresets.getPresets() as Presets;
      
      width = window.innerWidth;
      height = window.innerHeight;
      canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.width = width;
      canvas.height = height;
      audioContext = new AudioContext();
      visualizer = butterchurn.createVisualizer(audioContext, canvas, {
        width,
        height
      });
      darkCircle = visualizer.renderer.preset as Preset
      activePreset = 'darkCircle'
      presets = {darkCircle, ...presets}
      
      visualizerInitializer();
      resize();
    });
  
    onDestroy(() => {
      visualizer = null;
      audioContext = null;
    });

  const handleSelectChange = (preset) => {
    activePreset = preset
    visualizer.loadPreset(presets[preset], 1.0);
  }

  const closeListener = () => {
    open = false;
    document.removeEventListener('click', closeListener);
  }

  const openModal = () => {
    open = !open
    if(!open) {
      closeListener()
    } else  {
      setTimeout(() => {
        document.addEventListener('click', closeListener);
      }, 0);
    }
  }
</script>
  {#if visualizer && audioContext}
    <SelectSong Visualizer={visualizer} audioContext={audioContext} />
  {/if}
  <div >
    <Modal bind:open right={true} listItems={presets} active={activePreset} parentFunction={handleSelectChange} width=400/>
  </div>
  <canvas id="canvas" />
  {#if open === false}
  <svg class="settings" on:click={openModal} xmlns="http://www.w3.org/2000/svg" width="10em" height="10em" viewBox="0 0 24 24" {...$$props}><path fill="currentColor" d="M13.875 22h-3.75q-.375 0-.65-.25t-.325-.625l-.3-2.325q-.325-.125-.613-.3t-.562-.375l-2.175.9q-.35.125-.7.025t-.55-.425L2.4 15.4q-.2-.325-.125-.7t.375-.6l1.875-1.425Q4.5 12.5 4.5 12.337v-.674q0-.163.025-.338L2.65 9.9q-.3-.225-.375-.6t.125-.7l1.85-3.225q.175-.35.537-.438t.713.038l2.175.9q.275-.2.575-.375t.6-.3l.3-2.325q.05-.375.325-.625t.65-.25h3.75q.375 0 .65.25t.325.625l.3 2.325q.325.125.613.3t.562.375l2.175-.9q.35-.125.7-.025t.55.425L21.6 8.6q.2.325.125.7t-.375.6l-1.875 1.425q.025.175.025.338v.674q0 .163-.05.338l1.875 1.425q.3.225.375.6t-.125.7l-1.85 3.2q-.2.325-.563.438t-.712-.013l-2.125-.9q-.275.2-.575.375t-.6.3l-.3 2.325q-.05.375-.325.625t-.65.25Zm-1.825-6.5q1.45 0 2.475-1.025T15.55 12q0-1.45-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12q0 1.45 1.012 2.475T12.05 15.5Z"/></svg>
  {:else}
  <svg class="settings" on:click={openModal} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="#6a2525" d="M8.27 3L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3M8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41"/></svg>
  {/if}
  <p class="active"><span>Preset</span> {activePreset}</p>
  <div class="random" class:random-active={randomizer}>
    <svg on:click={randomizer ? stopRandom : randomPresets} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><path fill="currentColor" d="m17 3l5.25 4.5L17 12l5.25 4.5L17 21v-3h-2.74l-2.82-2.82l2.12-2.12L15.5 15H17V9h-1.5l-9 9H2v-3h3.26l9-9H17V3M2 6h4.5l2.82 2.82l-2.12 2.12L5.26 9H2V6Z"/></svg>
  </div>

<style lang=scss scoped>
  @use '../style/variables.scss';
  @use '../style/mixins.scss';

  canvas {
    z-index: -1;
  }
  .random {
    position: absolute;
    cursor: pointer;
    bottom: 0.7em;
    right: 4em;
    svg {
      color: variables.$setting;
      width: 1.5em;
      height: 1.5em;
      &:hover {
        color: variables.$setting-hover;
      }
    }
      &::before {
      content: '';
      position: absolute;
      left: 0; 
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: variables.$inactive;
    }
  }

  .random-active.random {
    &::before {
      background-color: variables.$active;
    }
  }

  .settings {
    @include mixins.setting-right();
  }
  .active {
    @include mixins.active-right();
  }
</style>