import React, { useContext, useEffect, useCallback } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'
import { updateCurrentAudioTime } from '../../States/States'
import { timelineConfig } from '../../config'
import ProjectName from './ProjectName'
import AudioBtn from './AudioBtn'
import AudioMuteBtn from './AudioMuteBtn'
import AudioVolume from './AudioVolume'
import PlayBtn from './PlayBtn'
import PauseBtn from './PauseBtn'
import StopBtn from './StopBtn'
import RecordBtn from './RecordBtn'
import FastForwardLeftBtn from './FastForwardLeftBtn'
import FastForwardRightBtn from './FastForwardRightBtn'
import Undo from './Undo'
import Redo from './Redo'
import Load from './Load'
import Save from './Save'

export default () => {
    const { config, setConfig, tracks, setTracks, pastQueue, setPastQueue } = useContext(PlayerContext)

    const playHandler = () => {
        setConfig({
            ...config,
            headIsMoving: true,
        })
    }

    const pauseHandler = () => {
        setConfig({
            ...config,
            headIsMoving: false,
        })
    }
    const stopHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            headIsMoving: false,
            currentPlayTime: 0,
        })
        updateCurrentAudioTime(tracks, 0, false)
    }

    const muteHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            mute: true
        })
    }

    const unmuteHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            mute: false,
        })
    }

    const backwardHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        let time = Math.max(0, config.currentPlayTime - config.secondsPerBox)
        setConfig({
            ...config,
            currentPlayTime: time
        })
        updateCurrentAudioTime(tracks, time, config.headIsMoving)
    }

    const forwardHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        let time = Math.min(timelineConfig.timelineMinBoxNumbers * config.secondsPerBox, config.currentPlayTime + config.secondsPerBox)
        setConfig({
            ...config,
            currentPlayTime: time
        })
        updateCurrentAudioTime(tracks, time, config.headIsMoving)
    }

    const getKeyEvent = useCallback((e) => {
        const { keyCode } = e;
        if (keyCode === 32) {
            setConfig({
                ...config,
                headIsMoving: !config.headIsMoving,
            })
        }
    })

    useEffect(() => {
        document.addEventListener('keydown', getKeyEvent)
        return () => {
            document.removeEventListener('keydown', getKeyEvent)
        }
    }, [getKeyEvent])

    return (
        <div className="main-player">
            <ProjectName />
            {!config.mute && <AudioBtn muteHandler={muteHandler} />}
            {config.mute && <AudioMuteBtn unmuteHandler={unmuteHandler} />}
            <AudioVolume />
            <RecordBtn />
            <StopBtn stopHandler={stopHandler}/>
            <FastForwardLeftBtn backwardHandler={backwardHandler} />
            {!config.headIsMoving && <PlayBtn playHandler={playHandler} />}
            {config.headIsMoving && <PauseBtn pauseHandler={pauseHandler} />}
            <FastForwardRightBtn forwardHandler={forwardHandler} />
            <Undo />
            <Redo />
            <Load />
            <Save />
        </div>
    )
};
