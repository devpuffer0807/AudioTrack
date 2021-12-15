import React, { useState, useEffect } from 'react'
import waveformService from './Waveform.service'
import { waveformStyle } from '../playerStyle'

export default ({
                    decodedBuffer,
                    audioProgress,
                    color,
                    waveformWidth,
                    id,
                }) => {
    const [waveformMasks, setWaveformMasks] = useState(0)

    useEffect(() => {
        if (decodedBuffer.length > 0) {
            const waveformMask = waveformService({
                buffer: decodedBuffer,
                waveformWidth: waveformWidth,
            })
            setWaveformMasks(waveformMask)
        }
    }, [decodedBuffer, waveformWidth])

    return (
        <div
            className="waveform"
            style={{
                ...waveformStyle,
                width: waveformWidth,
                backgroundColor: color,
            }}
        >
            <svg
                viewBox="0 0 100 100"
                className="waveform-container"
                style={{
                    width: waveformWidth,
                }}
                preserveAspectRatio="none"
            >
                <rect
                    style={{
                        clipPath: 'url(#' + id + ')',
                        fill: 'rgba(229, 231, 235,.4)',
                    }}
                    x="0"
                    y="0"
                    height="100"
                    width="100"
                />
                <rect
                    style={{clipPath: 'url(#' + id + ')', fill: '#F3F4F6'}}
                    x="0"
                    y="0"
                    height="100"
                    width={audioProgress}
                />
            </svg>

            <svg height="0" width="0">
                <defs>
                    <clipPath id={id}>{waveformMasks}</clipPath>
                </defs>
            </svg>
        </div>
    )
};
