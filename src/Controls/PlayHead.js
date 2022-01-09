import React, { useEffect, useState, useContext } from 'react'
import useInterval from '../helpers/useInterval'
import { PlayerContext } from '../Context/PlayerContext'
import { updateCurrentAudioTime } from '../States/States'
import { timelineConfig } from '../config'
import { playHeadTopStyle } from '../timeline/timelineStyle'
import positionToTime from '../helpers/positionToTime'

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export default ({ timelineScrollContainerElem }) => {
    const { tracks, config, setConfig, pastQueue, setPastQueue } = useContext(PlayerContext)
    const { secondsPerBox, currentPlayTime, headIsMoving } = config
    const { timelineBoxSize } = timelineConfig
    const arrowWidth = 10
    const [mouseDrag, setMouseDrag] = useState(false)
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
        if (!mouseDrag && headIsMoving) {
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
        // let audioFlag
        // tracks.map((track, index) => (
        //     track.audioFiles.map((audioFile) => (
        //         audioFlag = !(audioFile.audioElement && audioFile.audioElement.duration > 0) ? false : true
        //     ))
        // ))

        // console.log(e)

        if(e.pageX < 265) {
            return false;
        }
        if(e.pageX > (windowDimensions.width - 50)){
            return false;
        }
        
        let audioFlag = true
        tracks.map((track, index) => (
            track.audioFiles.map((audioFile) => (
                audioFlag = audioFlag && (!(audioFile.audioElement && audioFile.audioElement.duration > 0) ? false : true)
            ))
        ))
        
        if(audioFlag == false)
            return;
        const time = positionToTime({
            event: e,
            container: timelineScrollContainerElem,
            config: config,
        })
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            currentPlayTime: time,
        })
        updateCurrentAudioTime(tracks, time, headIsMoving)
    }

    const onMouseDownHandler = (e) => {
        updatePosition(e)
        setMouseDrag(true)
    }

    const onMouseUpHandler = (e) => {
        if (mouseDrag) {
            setMouseDrag(false)
        }
        setMouseDrag(true)
    }

    const onMouseLeaveHandler = (e) => {
        if (mouseDrag) {
            setMouseDrag(false)
        }
    }

    const onMouseMoveHandler = (e) => {
        if (mouseDrag) {
            updatePosition(e)
        }
    }
    const onMouseDragHandler = (e) => {
        updatePosition(e)
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
        <div className="playHead-container">
            <div
                className="playHead-top-line"
                style={playHeadTopStyle}
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
                onMouseLeave={onMouseLeaveHandler}
                onMouseMove={onMouseMoveHandler}
                onDrag={onMouseDragHandler}
            />
            <div
                style={styles.playHead}
                className="playHead"
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
                onMouseLeave={onMouseLeaveHandler}
                onMouseMove={onMouseMoveHandler}
                onDrag={onMouseDragHandler}
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
