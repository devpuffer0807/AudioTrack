import React, { useEffect, useState, useContext, useRef } from 'react'
import Draggable from 'react-draggable'
import { PlayerContext } from '../Context/PlayerContext'
import Waves from '../player/Waves'
import { timelineConfig } from '../config'
import { moveAudioToOtherTrack, updateAudio } from '../States/States'
import rangeIntersetct from '../helpers/rangeIntersetct'

export default ({
                    color,
                    audioFile,
                    trackIndex,
                    tracksCount,
                    tracklinesContainerElem,
                }) => {
    const {tracks, setTracks, config, setConfig, pastQueue, setPastQueue} = useContext(PlayerContext)
    const {id, start_at, waveformWidth, duration, audioElement, audioBufferRaw} = audioFile
    const {secondsPerBox, headIsMoving} = config
    const {timelineBoxSize} = timelineConfig
    const [translateX, setTranslateX] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isAllowedToDrop, setIsAllowedToDrop] = useState(true)
    const [cssCursor, setCssCursor] = useState('inherit') // inherit, pointer, not-allowed
    const [dragBoundaries, setDragBoundaries] = useState({
        left: 0,
        right: null,
        top: null,
        bottom: null,
    })
    const draggableNodeRef = useRef(null)

    useEffect(() => {
        if (!isAllowedToDrop) {
            setCssCursor('not-allowed')
        } else if (isAllowedToDrop && isDragging) {
            setCssCursor('pointer')
        } else {
            setCssCursor('inherit')
        }
    }, [isAllowedToDrop, isDragging])

    useEffect(() => {
        const current_track_index = trackIndex + 1
        const previous_tracks_count = trackIndex
        const next_tracks_count = tracksCount - current_track_index
        const position = (start_at / secondsPerBox) * timelineBoxSize
        setTranslateX(position)
        const parentNode = tracklinesContainerElem.current.getBoundingClientRect()
        const bond = {
            ...dragBoundaries,
            right: parentNode.width - waveformWidth,
            top: previous_tracks_count * timelineBoxSize * -1,
            bottom: next_tracks_count * timelineBoxSize,
        }
        setDragBoundaries(bond)
    }, [waveformWidth, tracksCount, start_at])

    const dragHandler = (e, node) => {
        if (!isDragging) {
            setIsDragging(true)
        }
        if (headIsMoving) {
            setConfig({
                ...config,
                headIsMoving: false,
            })
        }
        const move_by_index = Math.round(node.y / timelineBoxSize)
        const new_track_index = trackIndex + move_by_index
        const darggingOver = tracks.filter(
            (item, index) => index === new_track_index
        )
        if (darggingOver.length > 0) {
            const calculated_start_at =
                (node.x / timelineBoxSize) * secondsPerBox
            const intersection = darggingOver[0].audioFiles.filter((item) => {
                if (item.id == id) {
                    return false
                }
                return rangeIntersetct(
                    [calculated_start_at, calculated_start_at + duration],
                    [item.start_at, item.start_at + item.duration]
                )
            })
            const allowedToDrop = intersection.length === 0
            if (isAllowedToDrop !== allowedToDrop) {
                setIsAllowedToDrop(allowedToDrop)
            }
        }
    }

    const dropHandler = (e, node) => {
        if (!isAllowedToDrop || !isDragging) {
            return false
        }
        const move_by_index = Math.round(node.y / timelineBoxSize)
        const calculated_start_at = config.snap ? Math.round(node.x / timelineBoxSize) * secondsPerBox : (node.x / timelineBoxSize) * secondsPerBox
        if (node.y === 0 || move_by_index === 0) {
            // keep audio in same track and update start_at
            const upAudio = updateAudio(tracks, {
                id: id,
                start_at: calculated_start_at,
            })
            let tempTracks = [tracks];
            tempTracks[0][0].type = "tracks"
            setPastQueue([...pastQueue, ...tempTracks])
            setTracks(upAudio)
            return false
        }
        // switch track-line & update start_at
        setTracks(
            moveAudioToOtherTrack(
                tracks,
                audioFile,
                trackIndex,
                move_by_index,
                calculated_start_at
            )
        )
        return false
    }

    if (translateX == null) {
        return <span>loading</span>
    }

    return (
        <Draggable
            nodeRef={draggableNodeRef}
            bounds={dragBoundaries}
            position={{x: translateX, y: 2}}
            onDrag={(e, node) => dragHandler(e, node)}
            // onStart={(e) => onStartHandler(e)}
            onStop={(e, node) => {
                dropHandler(e, node)
                setIsDragging(false)
            }}
        >
            <div
                ref={draggableNodeRef}
                className="audioWavesDraggable"
                style={{cursor: cssCursor}}
            >
                <Waves audioFile={audioFile} color={color} trackIndex={trackIndex} setTracks={setTracks}/>
            </div>
        </Draggable>
    )
};
