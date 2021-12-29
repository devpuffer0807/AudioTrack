import React, { useContext, useCallback, useMemo, useState } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'
import { updateCurrentAudioTime } from '../../States/States'

export default () => {

    const { config, setConfig, tracks, setTracks, pastQueue, futureQueue, setPastQueue, setFutureQueue } = useContext(PlayerContext)

    const handler = () => {
        if (config.headIsMoving)
            return;
        if (futureQueue.length > 0) {
            switch (futureQueue.at(-1)[0].type) {
                case "config":
                    setConfig(futureQueue.at(-1)[0])
                    setPastQueue([...pastQueue, ...futureQueue.slice(-1)])
                    setFutureQueue(futureQueue.slice(0, -1))
                    updateCurrentAudioTime(tracks, futureQueue.at(-1)[0].currentPlayTime, false)
                    break;
                case "tracks":
                    setTracks(futureQueue.at(-1))
                    setFutureQueue(futureQueue.slice(0, -1))
                    setPastQueue([...pastQueue, ...futureQueue.slice(-1)])
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
