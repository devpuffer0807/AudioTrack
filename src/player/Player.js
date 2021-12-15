import React, { useState, useEffect } from "react";
import axios from "axios";
import WaveformPlayer from "./WaveformPlayer";
import Waveform from "./Waveform/Waveform";
import VolumeSlider from "./Controls/VolumeSlider";

import ReactAudioPlayer from "react-audio-player";
import mime from "mime-types";
import { randomColor } from "../config";

export default ({ src, id }) => {
    const [audioBuffer, setAudioBuffer] = useState(new ArrayBuffer(0));
    const [audioElement, setAudioElement] = useState({});
    const [audioProgress, setAudioProgress] = useState(0);
    const [blobUrl, setBlobUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.6);
    const [color] = useState(randomColor());

    useEffect(() => {
        let [filename, source] = [src, src];
        if (typeof src === "object") {
            [filename, source] = [src.path, src.blobUrl];
        }
        axios({ url: source, responseType: "arraybuffer" }).then((response) => {
            var blob = new Blob([response.data], {
                type: mime.lookup(filename),
            });
            var url = window.URL.createObjectURL(blob);
            setBlobUrl(url);
            setAudioBuffer(response.data);
        });
    }, [src]);

    const updateCurrentTime = (position) => {
        audioElement.currentTime = position * audioElement.duration;
    };

    const handleAudioListener = (currentTime) => {
        setAudioProgress((currentTime / audioElement.duration) * 100);
    };

    return (
        <div className="player-container">
            <ReactAudioPlayer
                src={blobUrl}
                muted={isMuted}
                volume={volume}
                listenInterval={100}
                onListen={handleAudioListener}
                onPause={(e) => setIsPlaying(false)}
                onPlay={(e) => setIsPlaying(true)}
                onEnded={(e) => setIsPlaying(false)}
                onSeeked={(e) => handleAudioListener(e.target.currentTime)}
                onLoadedMetadata={(meta) => setAudioElement(meta.target)}
            />
            {!isPlaying && (
                <div className="play-btn" onClick={(e) => audioElement.play()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={color}
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}

            {isPlaying && (
                <div
                    className="pause-btn"
                    onClick={(e) => audioElement.pause()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill={color}
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            )}
            <WaveformPlayer updateCurrentTime={updateCurrentTime}>
                <Waveform
                    audioBuffer={audioBuffer}
                    audioProgress={audioProgress}
                    duration={audioElement.duration}
                    color={color}
                    id={id}
                />
            </WaveformPlayer>
            <VolumeSlider
                volume={volume}
                setVolume={setVolume}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                color={color}
            />
        </div>
    );
};
