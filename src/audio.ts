const _audios: { [uri: string]: HTMLAudioElement } = {};
let _playingAudio: HTMLAudioElement | undefined = undefined;

export interface Fraction {
  index: number;
  total: number;
}

async function abortPlayingAudio() {
  if (_playingAudio) {
    _playingAudio.pause();
    _playingAudio.currentTime = 0;
    _playingAudio = undefined;
    await new Promise((r) => setTimeout(r, 100));
  }
}

export function loadAudio(uri: string) {
  return new Promise<HTMLAudioElement>((resolve, reject) => {
    let audio = _audios[uri];
    if (!audio) {
      audio = new Audio(uri);
      _audios[uri] = audio;
    } else if (audio.readyState == 4) {
      resolve(audio);
      return;
    }
    audio.onloadeddata = () => resolve(audio);
    audio.onerror = () => reject(new Error('Failed to load audio file'));
  });
}

export function playAudio(uri: string, rate: number, fraction?: Fraction) {
  return new Promise(async (resolve, reject) => {
    try {
      await abortPlayingAudio();
      const audio = await loadAudio(uri);
      _playingAudio = audio;
      audio.playbackRate = rate;
      const duration = audio.duration * 1000; // convert to ms
      let start, end;
      if (!fraction) {
        start = 0;
        end = duration;
      } else {
        const division = duration / fraction.total;
        start = division * (fraction.index - 1);
        end = start + division;
      }
      start = start / 1000;
      end = end / 1000;
      audio.currentTime = start;
      audio.ontimeupdate = () => {
        if (audio.currentTime >= end) {
          audio.pause();
        }
      };
      audio.onended = () => resolve(audio);
      audio.play();
    } catch (err) {
      reject(err);
    }
  });
}
