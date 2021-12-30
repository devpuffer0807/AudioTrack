import React, { useContext, useEffect, useState } from 'react'
import { PlayerContext } from '../Context/PlayerContext'
import { updateWaveFormWidth } from '../States/States'

export default () => {
    const {tracks, setTracks, config, setConfig, pastQueue, setPastQueue} = useContext(PlayerContext)
    const {secondsPerBox, zoomBy, maxZoom, minZoom, headIsMoving} = config
    const {zoomFlag, setZoomFlag} = useState(false)
    const zooms = [
        // {step: 1, text: '1 seconds'},
        {step: 2, text: '2 seconds'},
        {step: 5, text: '5 seconds'},
        {step: 10, text: '10 seconds'},
        {step: 20, text: '20 seconds'},
        {step: 30, text: '30 seconds'},
        {step: 60, text: '1 minute'},
        {step: 300, text: '5 minutes'},
        {step: 900, text: '15 minutes'}
    ]

    const zoomOutHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        setTracks(
            updateWaveFormWidth(tracks, secondsPerBox + zoomBy)
        )
        setConfig({
            ...config,
            secondsPerBox: secondsPerBox + zoomBy,
            headIsMoving: false,
        })
    }

    const zoomInHandler = () => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        if ((secondsPerBox - zoomBy) >= minZoom) {
            setTracks(
                updateWaveFormWidth(tracks, secondsPerBox - zoomBy)
            )
            setConfig({
                ...config,
                secondsPerBox: secondsPerBox - zoomBy,
                headIsMoving: false,
            })
        }
    }

    const settingHandler = () => {
        if (document.getElementById('zoomSettingBar').classList.contains('display-none')) {
            document.getElementById('zoomSettingBar').classList.remove('display-none')
        } else {
            document.getElementById('zoomSettingBar').classList.add('display-none')
        }
    }

    const stepHandler = ($event) => {
        setPastQueue([...pastQueue, [{
            ...config,
            headIsMoving: false,
            ...{type: "config",}
        }]])
        let tmpSecondPerBox = $event.target.value
        setTracks(
            updateWaveFormWidth(tracks, tmpSecondPerBox)
        )
        setConfig({
            ...config,
            secondsPerBox: tmpSecondPerBox,
            headIsMoving: false,
        })
        document.getElementById('zoomSettingBar').classList.add('display-none')
    }

    const snapHandler = () => {
        let snap = !config.snap
        setConfig({
            ...config,
            snap: snap
        })
    }

    return (
        <div className="zoom-container">
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="20" height="20"
                 className="snap-setting"
                 viewBox="0 0 24 24" fill={config.snap ? "currentColor" : "none"}
                 stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 onClick={snapHandler}
            >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <div className="zoom-setting-container">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="20" height="20"
                     className="zoom-setting"
                     viewBox="0 0 24 24" fill="none"
                     stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     onClick={settingHandler}
                >
                    <circle cx="12" cy="12" r="3"/>
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83
            2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1
            1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65
            1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65
            1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65
            1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83
            0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1
            2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2
            2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0
            1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <div id="zoomSettingBar" className="zoom-setting-bar display-none">
                    <ul>
                        {zooms.map(zoom => (
                            <li key={zoom.step} >
                            <label>
                                <input type="radio" name="zoomBy" value={zoom.step} onClick={stepHandler}
                                       defaultChecked={config.zoomBy === zoom.step}/>{zoom.text}
                            </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`zoom-in ${secondsPerBox - zoomBy <= 0 ? 'disabled' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={zoomInHandler}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="zoom-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={zoomOutHandler}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                />
            </svg>

        </div>
    )
};
