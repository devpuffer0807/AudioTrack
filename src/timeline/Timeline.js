import React, { useContext, useEffect, useRef } from 'react'
import { PlayerContext } from '../Context/PlayerContext'
import TimelineScroll from './TimelineScroll'
import Tracklines from './Tracklines'
import TimelineTracker from './TimelineTracker'
import MainPlayer from '../Controls/MainPlayer/MainPlayer'
import PlayHead from '../Controls/PlayHead'
import Uploader from '../uploader/Uploader'
import Controls from '../Controls/Controls'
import ZoomControls from '../Controls/Zoom'
import ImportFromServer from '../importer/ImportFromServer'
import { topTmpTrackerStyle } from './timelineStyle'

export default () => {
    const {tracks} = useContext(PlayerContext)
    const timelineScrollContainerElem = useRef()

    useEffect(() => {
        //console.log(tracks)
    })

    return (
        <>
            <MainPlayer/>
            <ZoomControls/>
            <div className="timeline-controls-container">
                <div className="controls-container">
                    <div
                        className="tmp_tracker"
                        style={topTmpTrackerStyle}
                    />
                    {tracks.map((track) => (
                        <Controls track={track} key={track.id}/>
                    ))}
                </div>
                <div
                    className="timelineScrollContainer"
                    ref={timelineScrollContainerElem}
                >
                    <TimelineScroll>
                        <TimelineTracker/>
                        <PlayHead
                            timelineScrollContainerElem={
                                timelineScrollContainerElem
                            }
                        />
                        <Tracklines
                            timelineScrollContainerElem={
                                timelineScrollContainerElem
                            }
                        />
                    </TimelineScroll>
                </div>
            </div>
            <Uploader/>
            <ImportFromServer/>
        </>
    )
};
