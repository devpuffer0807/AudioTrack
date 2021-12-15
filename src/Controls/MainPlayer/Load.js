import React, { useRef } from 'react'

export default () => {
    const fileInput = useRef(null);
    const handleClick = () => {
        fileInput.current.click();
    }
    const handleChange = e => {
        const fileUpload = e.target.files[0];

    }
    return (
        <div className="main-player-load">
            <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleChange} />
            <input type="button" value={"Load"} onClick={handleClick} />
        </div>
    );
}
