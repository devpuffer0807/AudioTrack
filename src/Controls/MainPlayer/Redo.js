import React, { useContext, useCallback, useMemo, useState } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'
import { updateCurrentAudioTime, updateWaveFormWidth } from '../../States/States'

export default () => {

    const { config, setConfig, tracks, setTracks, pastQueue, futureQueue, setPastQueue, setFutureQueue, firstUndoFlag, setFirstUndoFlag } = useContext(PlayerContext)
    const {firstUndo, setFirstUndo} = useState(true)
    const handler = () => {
        if (config.headIsMoving)
            return;
        if (futureQueue.length > 0) {
            setFirstUndoFlag(true)
            switch (futureQueue.at(-1)[0].type) {
                case "config":
                    setConfig(futureQueue.at(-1)[0])
                    setPastQueue([...pastQueue, ...futureQueue.slice(-1)])
                    setFutureQueue(futureQueue.slice(0, -1))
                    updateCurrentAudioTime(tracks, futureQueue.at(-1)[0].currentPlayTime, false)
                    setTracks(
                        updateWaveFormWidth(tracks, futureQueue.at(-1)[0].secondsPerBox)
                    )
                    break;
                case "tracks":
                    setTracks(futureQueue.at(-1))
                    setFutureQueue(futureQueue.slice(0, -1))
                    setPastQueue([...pastQueue, ...futureQueue.slice(-1)])
                    break;
                case "tracksconfig":
                    setTracks(futureQueue.at(-1))
                    setFutureQueue(futureQueue.slice(0, -1))
                    setPastQueue([...pastQueue, ...futureQueue.slice(-1)])
                    setConfig({
                        ...futureQueue.at(-1)[0].config,
                        headIsMoving: false,
                    })
                    updateCurrentAudioTime(tracks, futureQueue.at(-1)[0].config.currentPlayTime, futureQueue.at(-1)[0].config.headIsMoving)
                    break;
                default:

            }
        }
    }

    return (
        <div className="icon-btn-redo" onClick={handler}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 16l6-6-6-6" />
                <path d="M4 21v-7a4 4 0 0 1 4-4h11" />
            </svg>
        </div>
    )
};
