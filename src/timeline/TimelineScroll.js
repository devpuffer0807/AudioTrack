import { timelineScrollStyle } from "./timelineStyle";

export default ({ children }) => {
    return (
        <div className="timeline-scroll-container">
            <div className="timeline-scroll" style={timelineScrollStyle}>
                {children}
            </div>
        </div>
    );
};
