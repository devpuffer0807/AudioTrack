import uuid from 'react-uuid'
import { randomColor } from '../config'
import calcWaveFormWidth from '../helpers/calcWaveFormWidth'

const PlayerState = ({id, src, filename, isBlob, color, start_at}) => {
  return {
    id: id ? id : uuid(),
    src: src,
    audioBufferRaw: new ArrayBuffer(0),
    decodedBufferRaw: [],
    createdBlobUrl: null,
    isBlob: isBlob ? isBlob : false,
    isPlaying: false,
    isMuted: false,
    volume: null,
    duration: null,

    audioElement: null,
    progress: 0,
    color: color ? color : randomColor(),
    filename: filename,
    loading: true,
    start_at: start_at ? start_at : 0,
    waveformWidth: 0,
  }
}

export default PlayerState

export const Track = ({id, color, name, params, audioFiles}) => {
  return {
    id: id ? id : uuid(),
    color: color ? color : randomColor(),
    name: name,
    params: params,
    audioFiles: audioFiles,
  }
}

export const updateAudio = (tracks, audioObj) => {
  let newAudioFileObj = null
  let newTracksObj = tracks.map((track) => {
    return {
      ...track,
      audioFiles: track.audioFiles.map((audioFile) => {
        return audioFile.id === audioObj.id
          ? newAudioFileObj = {
            ...audioFile,
            ...audioObj,
          }
          : audioFile
      }),
    }
  })
  // console.log("newObj", newAudioFileObj);
  return newTracksObj
}

export const updateWaveFormWidth = (tracks, secondsPerBox) => {
  return tracks.map((track) => {
    return {
      ...track,
      audioFiles: track.audioFiles.map((audioFile) => {
        return {
          ...audioFile,
          ...{
            waveformWidth: calcWaveFormWidth(
              audioFile.audioElement,
              secondsPerBox
            )
          },
        }
      }),
    }
  })
}

export const moveAudioToOtherTrack = (tracks, audioObj, curren_track_index, move_by_index, start_at) => {
  const new_track_index = curren_track_index + move_by_index
  let audioFileByID = []
  // console.log(audioFileByID);
  return tracks.map((track, index) => {
    if (audioFileByID.length === 0) {
      audioFileByID = track.audioFiles.filter((item) => item.id !== audioObj.id)
    }
    // console.log(audioFileByID);
    if (index == curren_track_index) {
      return {
        ...track,
        audioFiles: track.audioFiles.filter((item) => item.id !== audioObj.id),
      }
    }
    if (index == new_track_index) {
      return {
        ...track,
        audioFiles: [...track.audioFiles, ...[{
          ...audioObj,
          ...{
            start_at: start_at,
          }
        }]],
      }
    }
    return track
  })
}


export const getDraggableAudio = (tracks) => {
  let [exists, current_track_id, audioFile] = [false, null, null]
  for (let i = 0; i < tracks.length; i++) {
    audioFile = tracks[i].audioFiles.filter(item => item.dragging === true)
    if (audioFile.length > 0) {
      [exists, current_track_id, audioFile] = [true, tracks[i].id, audioFile[0]]
      break
    }
  }

  return [exists, current_track_id, audioFile]
}

export const updateState = (audioFiles, obj) => {
  return audioFiles.map((audioFile) => {
    return audioFile.id === obj.id
      ? {
        ...audioFile,
        ...obj,
      }
      : audioFile
  })
}

export const updateCurrentAudioTime = (tracks, currentTime, headIsMoving) => {
  return tracks.map((track) => {
    track.audioFiles.map((audioFile) => {
      if (currentTime >= audioFile.start_at && currentTime <= parseInt(audioFile.audioElement.duration) + audioFile.start_at) {
        audioFile.audioElement.currentTime = currentTime - audioFile.start_at
        if (headIsMoving && !audioFile.isPlaying) {
          audioFile.audioElement.play()
        }
      } else if (audioFile.start_at > currentTime) {
        audioFile.audioElement.pause()
        audioFile.audioElement.currentTime = 0
      } else if (parseInt(audioFile.audioElement.duration) + audioFile.start_at <= currentTime) {
        audioFile.audioElement.currentTime = audioFile.audioElement.duration
        if (audioFile.isPlaying) {
          audioFile.audioElement.pause()
        }
      }
    })
    return track
  })
}

export const storePreviousHistory = () => {

}