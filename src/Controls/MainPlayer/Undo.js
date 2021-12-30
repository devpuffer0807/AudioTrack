import React, { useContext, useCallback, useMemo, useState } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'
import { updateCurrentAudioTime, updateWaveFormWidth } from '../../States/States'


export default () => {

    const { config, setConfig, tracks, setTracks, pastQueue, futureQueue, setPastQueue, setFutureQueue } = useContext(PlayerContext)

    const handler = () => {
        if(config.headIsMoving)
            return ;
        if (pastQueue.length > 0) {
            // console.log("==========", futureQueue, pastQueue)
            switch (pastQueue.at(-1)[0].type) {
                case "config":
                    setConfig(pastQueue.at(-1)[0])
                    setFutureQueue([...futureQueue, ...pastQueue.slice(-1)])
                    setPastQueue(pastQueue.slice(0, -1))
                    updateCurrentAudioTime(tracks, pastQueue.at(-1)[0].currentPlayTime, false)
                    setTracks(
                        updateWaveFormWidth(tracks, pastQueue.at(-1)[0].secondsPerBox)
                    )
                    break;
                case "tracks":
                    setTracks(pastQueue.at(-1))
                    setPastQueue(pastQueue.slice(0, -1))
                    setFutureQueue([...futureQueue, ...pastQueue.slice(-1)])
                    break;
                case "tracksconfig":
                    setTracks(pastQueue.at(-1))
                    setPastQueue(pastQueue.slice(0, -1))
                    setFutureQueue([...futureQueue, ...pastQueue.slice(-1)])
                    setConfig({
                        ...pastQueue.at(-1)[0].config,
                        headIsMoving: false,
                    })
                    updateCurrentAudioTime(tracks, pastQueue.at(-1)[0].config.currentPlayTime, pastQueue.at(-1)[0].config.headIsMoving)
                    break;
                default:

            }
        }
    }

    return (
        <div className="icon-btn-undo" onClick={handler}>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 16l-6-6 6-6" />
                <path d="M20 21v-7a4 4 0 0 0-4-4H5" />
            </svg>
        </div>
    )
};