import React, { useContext, useEffect, useState } from 'react'
import { controlsTrackStyle, sliderTracksStyle, soloColor, muteColor, disableColor } from './controlsStyle'
import { PlayerContext } from '../Context/PlayerContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export default ({ track }) => {
    const [gain, setGain] = useState(track.params.gain)
    const { config, setConfig } = useContext(PlayerContext)
    const { tracks, setTracks } = useContext(PlayerContext)
    const { pastQueue, setPastQueue } = useContext(PlayerContext)

    const marks = {
        '-50': '-ထ',
        '-36': '-36',
        '-24': '-24',
        '-18': '-18',
        '-12': '-12',
        '-6': '-6',
        0: <strong>0</strong>,
        6: 6
    }

    const nameHandler = (event) => {
        let newTrack = tracks.map((trackItem) => {
            return track.id === trackItem.id ? {
                ...trackItem,
                name: event.target.value
            }
                : trackItem
        })
        setTracks(newTrack)
    }

    const gainHandler = (event) => {
        getNewTrack(event.target.value)
    }

    const getNewTrack = (value) => {
        let newTrack = tracks.map((trackItem) => {
            return track.id === trackItem.id ? {
                ...trackItem,
                params: {
                    ...track.params,
                    gain: parseInt(value)
                }
            }
                : trackItem
        })
        let tempTracks = [tracks];
        tempTracks[0][0].type = "tracks"
        setPastQueue([...pastQueue, ...tempTracks])
        setTracks(newTrack)
    }

    const soloHandler = (isSoloClicked) => {
        let solo = false // to check if solo is existed
        let newTrack = tracks.map((trackItem) => {
            if (!solo) {
                solo = track.id === trackItem.id ? !trackItem.params.solo : trackItem.params.solo
            }

            return track.id === trackItem.id ? {
                ...trackItem,
                params: {
                    ...track.params,
                    solo: !trackItem.params.solo,
                    // mute: isSoloClicked ? false : trackItem.params.mute
                }
            }
                : trackItem
        })
        setTracks(newTrack)

        setConfig({
            ...config,
            solo: solo
        })

    }

    const muteHandler = () => {
        if (config.solo && !track.params.solo) return

        let solo = false
        let newTrack = tracks.map((trackItem) => {
            if (track.id === trackItem.id) {
                solo = solo || trackItem.params.solo
            }

            return track.id === trackItem.id ? {
                ...trackItem,
                params: {
                    ...track.params,
                    solo: false,
                    mute: track.params.solo ? true : !trackItem.params.mute
                }
            }
                : trackItem
        })
        setTracks(newTrack)

        setConfig({
            ...config,
            solo: solo
        })
    }

    return (
        <div className="control-track" style={controlsTrackStyle}>
            <div className="track-name">
                <input type="text" value={track.name} onChange={nameHandler} />
            </div>
            <div className="track-solo-mute">
                <input type="button" value="S" style={{ backgroundColor: track.params.solo ? soloColor : disableColor }} onClick={() => soloHandler(true)} />
                <input type="button" value="M" style={
                    {
                        backgroundColor: config.solo ? (track.params.solo ? disableColor : muteColor) : (track.params.mute ? muteColor : disableColor)
                    }
                } onClick={muteHandler} />
            </div>
            <div className="track-gain">
                <Slider min={-50} max={6} marks={marks} step={1} defaultValue={gain} value={track.params.gain} style={sliderTracksStyle} onChange={getNewTrack} />
                <input type="number" value={track.params.gain} onChange={gainHandler} max={6} />
            </div>
        </div>
    )
};
