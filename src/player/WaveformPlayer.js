import React, { useState, useRef } from "react";

export default ({ children, updateCurrentTime }) => {
    const [mouseDrag, setMouseDrag] = useState(false);
    const containerElem = useRef();

    const updateCurrentTimePosition = (e) => {
        let bcr = containerElem.current.getBoundingClientRect();
        let position_in_percent = (e.clientX - bcr.left) / bcr.width; // ex 0.25 (25%)
        updateCurrentTime(position_in_percent);
    };

    const onMouseDownHandler = (e) => {
        updateCurrentTimePosition(e);
        setMouseDrag(true);
    };

    const onMouseUpHandler = (e) => {
        setMouseDrag(false);
    };

    const onMouseLeaveHandler = (e) => {
        if(mouseDrag) {
            setMouseDrag(false);
        }
    };

    const onMouseMoveHandler = (e) => {
        if (mouseDrag) {
            updateCurrentTimePosition(e);
        }
    };

    return (
        <div
            // ref={containerElem}
            // onMouseDown={onMouseDownHandler}
            // onMouseUp={onMouseUpHandler}
            // onMouseLeave={onMouseLeaveHandler}
            // onMouseMove={onMouseMoveHandler}
        >
            {children}
        </div>
    );
};
