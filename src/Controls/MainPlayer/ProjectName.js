import React, { useContext } from 'react'
import { PlayerContext } from '../../Context/PlayerContext'

export default () => {
    const { config, setConfig, pastQueue, setPastQueue } = useContext(PlayerContext)

    const nameHandler = (event) => {
        setPastQueue([...pastQueue, [{
            ...config,
            ...{type: "config",}
        }]])
        setConfig({
            ...config,
            name: event.target.value
        })
    }

    return (
        <div className="main-player-name">
            <input type="text" defaultValue={config.name} onChange={nameHandler} value={config.name} />
        </div>
    );
}
