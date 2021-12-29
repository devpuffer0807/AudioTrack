import React, { useContext } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'

export default () => {
    const {config, setConfig, pastQueue, setPastQueue} = useContext(PlayerContext)

    const volumeHandler = (event) => {
        
        setPastQueue([...pastQueue, [{
            ...config,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            volume: parseFloat(event.target.value) / 20
        })
    }

    return (
        <div className="main-player-volume">
            <input type="range" min="0" max="20" value={(config.volume * 20).toString()}
                   onChange={volumeHandler}
            />
        </div>
    );
};