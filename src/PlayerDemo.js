import React, { useState } from "react";
import Player from "./player/Player";
import Uploader from "./uploader/Uploader";
import uuid from "react-uuid";

export default () => {
    const [files, setFiles] = useState(["audio/piano-1.mp3"]);

    return (
        <div className="audio-player-container">
            {files.map((file, index) => (
                <Player
                    src={file}
                    id={uuid()}
                    key={index}
                />
            ))}
            <Uploader setFiles={setFiles} files={files} />
        </div>
    );
}