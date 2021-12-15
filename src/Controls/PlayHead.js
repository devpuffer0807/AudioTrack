import React, { useEffect, useState, useContext } from 'react'
import useInterval from '../helpers/useInterval'
import { PlayerContext } from '../Context/PlayerContext'
import { updateCurrentAudioTime } from '../States/States'
import { timelineConfig } from '../config'
import { playHeadTopStyle } from '../timeline/timelineStyle'
import positionToTime from '../helpers/positionToTime'

export default ({ timelineScrollContainerElem }) => {
    const { tracks, config, setConfig } = useContext(PlayerContext)
    const { secondsPerBox, currentPlayTime, headIsMoving } = config
    const { timelineBoxSize } = timelineConfig
    const arrowWidth = 10
    const [mouseDrag, setMouseDrag] = useState(false)
    const [translateX, setTranslateX] = useState(0)
    const secondsRefreshValue = secondsPerBox / 100
    useInterval(() => {
        if (!mouseDrag && headIsMoving) {
            console.log(secondsRefreshValue)
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

    const onMouseDownHandler = (e) => {
        updatePosition(e)
        setMouseDrag(true)
    }

    const onMouseUpHandler = (e) => {
        setMouseDrag(false)
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
                // onMouseUp={onMouseUpHandler}
                // onMouseLeave={onMouseLeaveHandler}
                // onMouseMove={onMouseMoveHandler}
                onDrag={onMouseDragHandler}
            />
            <div
                style={styles.playHead}
                className="playHead"
                onMouseDown={onMouseDownHandler}
                // onMouseUp={onMouseUpHandler}
                // onMouseLeave={onMouseLeaveHandler}
                // onMouseMove={onMouseMoveHandler}
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
