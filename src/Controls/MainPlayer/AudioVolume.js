import React, { useContext } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'

export default () => {
    const {config, setConfig} = useContext(PlayerContext)

    const volumeHandler = (event) => {
        setConfig({
            ...config,
            volume: parseFloat(event.target.value) / 20
        })
    }

    return (
        <div className="main-player-volume">
            <input type="range" min="0" max="20" defaultValue={(config.volume * 20).toString()}
                   onChange={volumeHandler}
            />
        </div>
    );
};