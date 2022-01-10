import React, { useEffect, useState, useContext } from 'react'
import useInterval from '../helpers/useInterval'
import { PlayerContext, config } from '../Context/PlayerContext'
import { updateCurrentAudioTime } from '../States/States'
import { timelineConfig } from '../config'
import { playHeadTopStyle } from '../timeline/timelineStyle'
import positionToTime from '../helpers/positionToTime'
import { timelineBoxSize } from "../config"

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

let renderTime = 0;
let renderPageX = 0;
let mouseDrag = false;
let deltaX = 260

export default ({ timelineScrollContainerElem }) => {
    const { tracks, config, setConfig, pastQueue, setPastQueue } = useContext(PlayerContext)
    const { secondsPerBox, currentPlayTime, headIsMoving } = config
    const { timelineBoxSize } = timelineConfig
    const arrowWidth = 10
    const [translateX, setTranslateX] = useState(0)
    const secondsRefreshValue = secondsPerBox / 100
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useInterval(() => {
        if (headIsMoving) {
            // console.log(secondsRefreshValue)
            setConfig({
                ...config,
                currentPlayTime: currentPlayTime + secondsRefreshValue,
            })
        }
    }, secondsRefreshValue * 1000) // each 0.01 seconds

    useEffect(() => {
        let position = (currentPlayTime / secondsPerBox) * timelineBoxSize
        setTranslateX(position - arrowWidth)
    }, [currentPlayTime, secondsPerBox])



    const updatePosition = (e) => {
        let curTime = new Date().getTime();
        if ((curTime - renderTime) < 50)
            return false;
        renderTime = curTime;

        if (Math.abs(renderPageX - e.pageX) < 5) {
            return false;
        }

        if (e.pageX < deltaX) {
            return false;
        }
        if (e.pageX > (windowDimensions.width - 50)) {
            return false;
        }

        let audioFlag = true
        tracks.map((track, index) => (
            track.audioFiles.map((audioFile) => (
                audioFlag = audioFlag && (!(audioFile.audioElement && audioFile.audioElement.duration > 0) ? false : true)
            ))
        ))

        if (audioFlag == false)
            return;

        let time = 0;
        if (window.STEP_MARK) {
            let boxCount = Math.floor((e.clientX - deltaX) / timelineBoxSize);
            time = positionToTime({
                event: { clientX: (boxCount * timelineBoxSize + deltaX) },
                container: timelineScrollContainerElem,
                config: config,
            })
        } else {
            time = positionToTime({
                event: e,
                container: timelineScrollContainerElem,
                config: config,
            })
        }

        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{ type: "config", }
        }]])
        setConfig({
            ...config,
            currentPlayTime: time,
        })
        updateCurrentAudioTime(tracks, time, headIsMoving)
    }

    const updateClickPosition = (e) => {
        let time = 0;
        if (window.STEP_MARK) {
            let boxCount = Math.floor((e.clientX - deltaX) / timelineBoxSize);
            time = positionToTime({
                event: { clientX: (boxCount * timelineBoxSize + deltaX) },
                container: timelineScrollContainerElem,
                config: config,
            })
        } else {
            time = positionToTime({
                event: e,
                container: timelineScrollContainerElem,
                config: config,
            })
        }

        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{ type: "config", }
        }]])
        setConfig({
            ...config,
            currentPlayTime: time,
        })
        updateCurrentAudioTime(tracks, time, headIsMoving)
    }

    const onMouseDrag = (e) => {
        return updatePosition(e)
        mouseDrag = !mouseDrag;
        if (mouseDrag) {
            updatePosition(e)
        }
    }

    const styles = {
        playHead: {
            transform: `translate(${translateX}px`,
        },
        playHeadTop: {
            width: arrowWidth * 2,
            height: 15,
        },
        playHeadArrow: {
            borderWidth: arrowWidth,
        },
    }

    return (
        <div className="playHead-container"
            onClick={updateClickPosition}
            style={{width: timelineConfig.timelineMinBoxNumbers*80}}
        >
            <div
                className="playHead-top-line"
                style={playHeadTopStyle}
            />
            <div
                style={styles.playHead}
                className="playHead"
                onDragEnd={() => { mouseDrag = false; }}
                onDrag={onMouseDrag}
            >
                <div className="playHead-top" style={styles.playHeadTop} />
                <div
                    className="playHead-head-arrow"
                    style={styles.playHeadArrow}
                />
                <div className="playHead-line" />
            </div>
        </div>
    )
};
