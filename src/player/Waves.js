import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import WaveformPlayer from './WaveformPlayer'
import Waveform from './Waveform/Waveform'
import ReactAudioPlayer from 'react-audio-player'
import mime from 'mime-types'
import { updateAudio } from '../States/States'
import { PlayerContext } from '../Context/PlayerContext'
import { timelineConfig } from '../config'
import calcWaveFormWidth from '../helpers/calcWaveFormWidth'

export default ({ audioFile, color, trackIndex }) => {
    const {
        id,
        src,
        audioBufferRaw,
        decodedBufferRaw,
        createdBlobUrl,
        filename,
        audioElement,
        volume,
        isMuted,
        loading,
        start_at,
        waveformWidth,
    } = audioFile
    const { tracks, setTracks, config, setConfig } = useContext(PlayerContext)
    const { currentPlayTime, headIsMoving, secondsPerBox } = config
    const [audioBuffer, setAudioBuffer] = useState(new ArrayBuffer(0))
    const [audioProgress, setAudioProgress] = useState(0)
    const [blobUrl, setBlobUrl] = useState(null)
    const [decodedBuffer, setDecodedBuffer] = useState([])
    const [countTimeLine, setCountTimeLine] = useState(0)
    let rap = React.createRef()

    useEffect(() => {
        if (audioBufferRaw.byteLength > 0) {
            setBlobUrl(createdBlobUrl)
            setAudioBuffer(audioBufferRaw)
            return
        }

        if (typeof src === 'string' || src instanceof String) {
            axios({ url: src, responseType: 'arraybuffer' }).then(
                (response) => {
                    var blob = new Blob([response.data], {
                        type: mime.lookup(filename),
                    })
                    var url = window.URL.createObjectURL(blob)
                    setBlobUrl(url)
                    setAudioBuffer(response.data)
                }
            )
        }
    }, [src])

    const drumPlay = () => {
        if (!rap.audioEl) return

        if (window._CONTEXT == undefined) {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            window._CONTEXT = new AudioContext();
        }
        const gainNode = window._CONTEXT.createGain()
        // gainNode.gain.value = tracks[trackIndex].params.gain;
        gainNode.gain.value = Math.pow(10, (tracks[trackIndex].params.gain/20));
        gainNode.connect(window._CONTEXT.destination)

        if (!rap.audioEl) return

        if (window.WEAK_MAP.has(rap.audioEl.current)) {
            let source = window.WEAK_MAP.get(rap.audioEl.current)
            source.disconnect()
            source.connect(gainNode)
        } else {
            let source = window._CONTEXT.createMediaElementSource(rap.audioEl.current)
            source.connect(gainNode)
            gainNode.connect(window._CONTEXT.destination)
            window.WEAK_MAP.set(rap.audioEl.current, source);
        }

    }

    useEffect(() => {
        console.log("============", tracks[trackIndex].params.gain, blobUrl)
        drumPlay();
    }, [tracks[trackIndex].params.gain])

    // useEffect(() => {
    //     drumPlay();
    // }, [blobUrl])

    useEffect(() => {
        if (decodedBufferRaw.length > 0) {
            setDecodedBuffer(decodedBufferRaw)
            return
        }
        if (audioBuffer.byteLength > 0) {
            let audioCtx = new (window.AudioContext ||
                window.webkitAudioContext)()
            audioCtx.decodeAudioData(audioBuffer, (buffer) => {
                setDecodedBuffer(buffer)
            })
        }
    }, [audioBuffer])

    useEffect(() => {
        if (decodedBuffer.length > 0 && decodedBufferRaw.length === 0) {
            setTracks(
                updateAudio(tracks, {
                    id: id,
                    decodedBufferRaw: decodedBuffer,
                })
            )
        }
    }, [decodedBuffer])

    useEffect(() => {
        if (
            !loading &&
            // audioElement.currentTime > 0 &&
            audioElement.currentTime != currentPlayTime - start_at
        ) {
            audioElement.currentTime = currentPlayTime - start_at
        }
    }, [start_at])
    
    useEffect(() => {
        if (
            !loading &&
            headIsMoving &&
            currentPlayTime >= start_at &&
            currentPlayTime <= audioElement.duration + start_at
        ) {
            // currentPlayTime = audioElement.currentTime + start_at
            setCountTimeLine(countTimeLine + 1);
            if(countTimeLine > 3){
                setConfig({
                    ...config,
                    currentPlayTime: audioElement.currentTime + start_at,
                })
                setCountTimeLine(0)
            }
            if (!audioFile.isPlaying) {
                if (currentPlayTime > 0 && audioElement.currentTime == 0) {
                    audioElement.currentTime = currentPlayTime - start_at
                }
                audioElement.play()
            }
        }
        if (!headIsMoving && audioFile.isPlaying) {
            audioElement.pause()
        }
    }, [headIsMoving, currentPlayTime])

    const updateCurrentTime = (position) => {
        audioElement.currentTime = position * audioElement.duration
    }
    const handleAudioListener = (currentTime) => {
        setAudioProgress((currentTime / audioElement.duration) * 100)
    }

    const setAudioElement = (elem) => {
        setTracks(
            updateAudio(tracks, {
                id: id,
                audioElement: elem,
                audioBufferRaw:
                    audioBuffer.byteLength > 0 &&
                        audioBufferRaw.byteLength === 0
                        ? audioBuffer.slice(0)
                        : audioBufferRaw,
                loading: false,
                waveformWidth: calcWaveFormWidth(elem, secondsPerBox),
                duration: elem.duration,
                createdBlobUrl: blobUrl,
            })
        )
    }

    const setIsPlaying = (isPlaying) => {
        setTracks(
            updateAudio(tracks, {
                id: id,
                isPlaying: isPlaying,
            })
        )
    }

    return (
        <div
            className="audioWavesContainer"
            onClick={(e) => e.stopPropagation()}
        >
            {blobUrl && (
                <ReactAudioPlayer
                    ref={(element) => { rap = element }}
                    src={blobUrl}
                    muted={(config.solo && !tracks[trackIndex].params.solo) ||
                        (config.mute ||
                            (!config.solo &&
                                (tracks[trackIndex].params.mute || (config.solo && !tracks[trackIndex].params.solo))
                            )
                        )}
                    volume={config.volume}
                    listenInterval={100}
                    onListen={handleAudioListener}
                    onPause={(e) => setIsPlaying(false)}
                    onPlay={(e) => setIsPlaying(true)}
                    onEnded={(e) => setIsPlaying(false)}
                    onSeeked={(e) => handleAudioListener(e.target.currentTime)}
                    onLoadedMetadata={(meta) => setAudioElement(meta.target)}
                />
            )}
            {audioElement && audioElement.duration > 0 && (
                <WaveformPlayer updateCurrentTime={updateCurrentTime}>
                    <Waveform
                        decodedBuffer={decodedBuffer}
                        audioProgress={audioProgress}
                        color={color}
                        waveformWidth={waveformWidth}
                        id={id}
                    />
                </WaveformPlayer>
            )}
        </div>
    )
};
