import { useContext, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { modalStyles } from '../config'
import PlayerState, { Track } from '../States/States'
import { PlayerContext} from '../Context/PlayerContext'

export default () => {
    const {tracks, setTracks} = useContext(PlayerContext)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [files, setFiles] = useState([])
    const [error, setError] = useState(null)

    // const files = [
    //     PlayerState({
    //         src: 'audio/guitar-1.mp3',
    //         filename: 'guitar-1.mp3',
    //         start_at: 40, // seconds
    //         isBlob: true,
    //     }),
    //     PlayerState({
    //         src: 'audio/drum-1.mp3',
    //         filename: 'drum-1.mp3',
    //         start_at: 25, // seconds
    //         isBlob: true
    //     }),
    // ]

    const openModal = () => {
        setIsOpen(true)
    }

    const afterOpenModal = () => {

    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const addAudioFile = (file) => {
        setTracks([...tracks, Track({audioFiles: [file]})])
    }

    useEffect(() => {
        fetch('https://api.example.com/items')
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true)
                    setFiles(result)
                },
                (error) => {
                    setIsLoaded(true)
                    setError(error)
                }
            )
    }, [])

    useEffect(() => {
        Modal.setAppElement('body')
    }, [])

    return (
        <div className="import-from-server">
            <input type="button" value="Import audio from list of files on server"
                   onClick={openModal}
            />
            <Modal
                isOpen={isOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={modalStyles}
                contentLabel="Import audio from server"
            >
                <h1>The list of files from server</h1>
                <ul>
                    {files.map((file, index) => (
                        <li key={index} onClick={() => addAudioFile(file)}>
                            {file.filename}
                        </li>
                    ))}
                </ul>
            </Modal>
        </div>
    )
}
