<script>
  import Modal from "./Modal.svelte";

 
  export let audioContext;
  export let Visualizer;

  let songList = {
    polishdunk: ' https://stream.open.fm/13',
    dunking: 'https://stream.open.fm/41',
    something: 'http://stream.open.fm/141',
    trance: 'http://stream.open.fm/7',
    dunk: 'https://stream.open.fm/128',
    electric: 'https://stream.open.fm/94'
  }
  let audioFile = null;
  let source = null;
  let playing = false;
  let activeMusic = Object.keys(songList)[1]
  let url
  let open = false
  const radio = () => {
    if (audioFile !== null) {
      audioFile.pause();
      audioFile = null
    } else {
      if(!url) {
        url = "https://stream.open.fm/41";
      }
      audioFile = new Audio(url);
      audioFile.crossOrigin = "anonymous";
      //   audioFile.src = url;
      audioContext.resume()
      audioFile.load();
      audioFile.play().then(() => {
        source = audioContext.createMediaElementSource(audioFile);
        source.connect(audioContext.destination);
        Visualizer.connectAudio(source);
        
        audioFile.addEventListener("ended", () => {
          playing = false;
        });

        playing = true;
      }).catch(error => {
        console.log(error);
      });
    }
  };
  
  const playAudio = () => {
    if(playing) {
      audioFile.pause();
      playing = false;
    } else if (audioFile !== null) {
      audioFile.pause();
      audioFile.play();
      playing = true;
    } else {
      radio();
      playing = true;
    }
  };

  const updateMusic = (stream) => {
    url = songList[stream];
    activeMusic = stream
    if(audioFile && playing == true) {
      audioFile.removeEventListener("ended", () => {
        playing = false;
      });
      
      audioFile.pause()
      console.log(audioFile)
      source.disconnect()
      // audioFile = new Audio(url);
      audioFile.src = url
      console.log(audioContext.destination)

      audioFile.crossOrigin = "anonymous";
      // audioContext.resume()
      // audioFile.load();
      audioFile.play().then(() => {
        // source = audioContext.createMediaElementSource(audioFile);
        source.connect(audioContext.destination);
        Visualizer.connectAudio(source);
        audioFile.addEventListener("ended", () => {
          playing = false;
        });
      })
    }
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
<div >
  <p class="active"><span>Audio</span> {activeMusic}</p>
  <Modal bind:open right={false} listItems={songList} active={activeMusic} width=300 parentFunction={updateMusic} />
</div>

<svg class="music" on:click={openModal} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><circle cx="16" cy="17" r="1" fill="currentColor" opacity=".3"/><path fill="currentColor" d="M3 10h12v2H3v-2zm0 4h8v2H3v-2zm0-8h12v2H3V6zm14 8.18c-.31-.11-.65-.18-1-.18c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3V8h3V6h-5v8.18z"/></svg>
  <button class="button" class:paused={playing} on:click={playAudio}></button>
  
<style lang="scss">
  audio {
    display: none;
  }

  .active {
    position: absolute;
    top: 0.1rem;
    left: 2em;
    color: #2e2e2e;
    background-color: #dad8d8d5;
    backdrop-filter: blur(4em);
    padding: 4px;
    border-radius: 4px;
    span {
      color: #141414;
      font-weight: 600;
    }
  }
  
  .music {
    position: absolute;
    cursor: pointer;
    bottom: 1em;
    left: 2em;
    width: 1.5em;
    color: #686666;
    height: 1.5em;
    &:hover {
      color: #827d7d;
    }
  }

  .controls {
    position: absolute;
    bottom: 1em;
    left: calc(50vw - 20px);
    border: none;
    font-size: 4em;
    background-color: #ffffff3f;
    backdrop-filter: blur(4em);
    border-radius: 50%;
  }


  .button {
    position: absolute;
    bottom: 1em;
    left: calc(50vw - 20px);
    border: 0;
    background: transparent;
    box-sizing: border-box;
    width: 0;
    height: 50px;
    border-color: transparent transparent transparent #202020;
    transition: 300ms all ease;
    cursor: pointer;

    // play state
      border-style: solid;
      border-width: 25px 0 25px 40px;

    &.paused {
      border-style: double;
      border-width: 0px 0 0px 40px;
    }

    &:hover {
      border-color: transparent transparent transparent #404040;
    }
  }
</style>