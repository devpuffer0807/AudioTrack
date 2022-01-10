import { PlayerContextProvider } from './Context/PlayerContext'
import TimelineDemo from './TimelineDemo'
import './App.css'

window.WEAK_MAP = new WeakMap();
window.STEP_MARK = true;

function App() {
    return (
        <PlayerContextProvider>
            <TimelineDemo />
        </PlayerContextProvider>
    )
}

export default App
