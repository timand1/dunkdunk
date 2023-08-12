<script> 
  export let audioContext;
  export let Visualizer;

  let audioFile = null;
  let source = null;
  let playing = false;
  
  const radio = () => {
    if (audioFile !== null) {
      audioFile.pause();
    } else {
      let url = "http://stream.open.fm/141";
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
</script>

  <audio src="http://stream.open.fm/141" controls></audio>
  <button class="button" class:paused={playing} on:click={playAudio}></button>
  
<style lang="scss">
  audio {
    display: none;
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
    &:hover {
      color: red;
    }
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