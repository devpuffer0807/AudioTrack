import React, { useMemo, useContext } from 'react'
import { useDropzone } from 'react-dropzone'
import {
    baseStyle,
    baseStyle1,
    activeStyle,
    acceptStyle,
    rejectStyle,
    containerStyle,
} from './uploaderStyle'
import PlayerState, { Track } from '../States/States'
import { PlayerContext } from '../Context/PlayerContext'

export default () => {
    const { tracks, setTracks } = useContext(PlayerContext)
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: 'audio/*',
        onDrop: (acceptedFiles) => {
            const newTracks = acceptedFiles.map((file) => {
                const audioFile = PlayerState({
                    src: URL.createObjectURL(file),
                    filename: file.name,
                    isBlob: true,
                })
                return Track({
                    name: '',
                    params: {
                        gain: 0,
                        solo: false,
                        mute: false,
                    },
                    audioFiles: [audioFile]
                })
            })
            setTracks([...tracks, ...newTracks])
        },
    })

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    )

    const style1 = useMemo(
        () => ({
            ...baseStyle1,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    )

    return (
        <div className="uploader-container" style={containerStyle}>
            <div className='track-container' {...getRootProps({ style1 })}>
                <div style={baseStyle1}>
                    <input {...getInputProps()} />
                    <div className="track-placeholder">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            width={15}
                            height={15}
                        >
                            <path
                                fillRule="evenodd"
                                d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p>Add New Track</p>
                    </div>
                </div>
            </div>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <div className="uploader-placeholder">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        width={25}
                        height={25}
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p>Upload Audio file</p>
                </div>
            </div>
        </div>
    )
};
