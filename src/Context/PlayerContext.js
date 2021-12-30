import { createContext, useEffect, useState } from 'react'
import PlayerState, { Track } from '../States/States'
import Json from '../assets/tool_audio_data_sample.json'

const PlayerContext = createContext()

const PlayerContextProvider = ({ children }) => {
    const [tracks, setTracks] = useState([])
    const [config, setConfig] = useState({})
    const [pastQueue, setPastQueue] = useState([])
    const [futureQueue, setFutureQueue] = useState([])

    useEffect(() => {
        let solo = false
        for (const track of Json.tracks) {
            let dummyAudios = []
            for (const sample of track.samples) {
                dummyAudios.push(
                    PlayerState({
                        src: sample.url,
                        filename: sample.filename,
                        start_at: sample.start
                    })
                )
            }
            setTracks([
                ...tracks,
                Track({
                    name: track.name,
                    params: {
                        gain: track.params.gain,
                        solo: track.params.solo,
                        mute: track.params.mute,
                    },
                    audioFiles: dummyAudios
                })
            ])
            solo = solo || track.params.solo
        }
        setConfig({
            ...config,
            name: Json.name,
            secondsPerBox: Json.config.grid,
            zoomBy: Json.config.zoom,
            maxZoom: 60 * 10,
            minZoom: 2,
            currentPlayTime: 5,
            headIsMoving: false,
            snap: Json.config.snap,
            solo: solo,
            mute: false,
            volume: 0.5,
            historyFlag: true
        })
    }, [])

    return (
        <PlayerContext.Provider
            value={{ config, setConfig, tracks, setTracks, pastQueue, futureQueue, setPastQueue, setFutureQueue }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export { PlayerContext, PlayerContextProvider }
