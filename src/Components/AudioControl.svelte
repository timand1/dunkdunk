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
    electric: 'https://stream.open.fm/94',
    svennis: '/src/assets/happysven.m4a'
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
    } else {
      if(!url) {
        url = "/src/assets/happysven.m4a";
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
    if(audioFile) {
      audioFile.pause()
      audioFile = new Audio(url);
      audioFile.crossOrigin = "anonymous";
      audioContext.resume()
      audioFile.load();
      audioFile.play().then(() => {
        source = audioContext.createMediaElementSource(audioFile);
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
  <Modal bind:open right={false} listItems={songList} active={activeMusic} parentFunction={updateMusic} />
</div>

<svg class="music" on:click={openModal} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}><circle cx="16" cy="17" r="1" fill="#827d7d" opacity=".3"/><path fill="#827d7d" d="M3 10h12v2H3v-2zm0 4h8v2H3v-2zm0-8h12v2H3V6zm14 8.18c-.31-.11-.65-.18-1-.18c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3V8h3V6h-5v8.18z"/></svg>
  <audio src="/src/assets/happysven.m4a" controls></audio>
  <button class="button" class:paused={playing} on:click={playAudio}></button>
  
<style lang="scss">
  audio {
    display: none;
  }
  
  .music {
    position: absolute;
    cursor: pointer;
    bottom: 1em;
    left: 2em;
    width: 1.5em;
    color: #202020;
    height: 1.5em;
    &:hover {
      color: #404040;
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