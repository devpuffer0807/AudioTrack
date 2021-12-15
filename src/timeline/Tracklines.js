import React, { useContext, useRef } from 'react'
import { PlayerContext } from '../Context/PlayerContext'
import positionToTime from '../helpers/positionToTime'
import { updateCurrentAudioTime } from '../States/States'
import DraggableWave from './DraggableWave'
import { timelineTracklineStyle } from './timelineStyle'

export default ({timelineScrollContainerElem}) => {
    const {tracks, config, setConfig} = useContext(PlayerContext)
    const {headIsMoving} = config
    const tracklinesContainerElem = useRef()
    const handleClickOnEmptySpace = (e) => {
        updateCursorPosition(e)
    }

    const updateCursorPosition = (e) => {
        const time = positionToTime({
            event: e,
            container: timelineScrollContainerElem,
            config: config,
        })
        setConfig({
            ...config,
            currentPlayTime: time,
        })
        updateCurrentAudioTime(tracks, time, headIsMoving)
    }

    return (
        <div className="tracklines" ref={tracklinesContainerElem}>
            {tracks.map((track, index) => (
                <div
                    className="trackline"
                    style={timelineTracklineStyle}
                    key={index}
                    onClick={handleClickOnEmptySpace}
                >
                    {track.audioFiles.map((audioFile) => (
                        <DraggableWave
                            audioFile={audioFile}
                            color={track.color}
                            key={audioFile.id}
                            trackIndex={index}
                            tracksCount={tracks.length}
                            tracklinesContainerElem={tracklinesContainerElem}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
};
