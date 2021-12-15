import React, { useContext } from 'react'
import { timelineConfig } from '../config'
import { PlayerContext } from '../Context/PlayerContext'
import { timelineTrackerStyle, timelineTimeValueStyle } from './timelineStyle'

export default () => {
    const {config} = useContext(PlayerContext)
    return (
        <div className="time-tracker" style={timelineTrackerStyle}>
            {[...Array(timelineConfig.timelineMinBoxNumbers)].map((x, i) => (
                <div className="time-value" style={timelineTimeValueStyle} key={i}>
                    {(i * config.secondsPerBox).toString()}
                </div>
            ))}
        </div>
    )
};
