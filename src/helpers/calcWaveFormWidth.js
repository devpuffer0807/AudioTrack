import { timelineConfig } from "../config";

export default (audioElement, secondsPerBox) => {
    const { timelineBoxSize } = timelineConfig;
    return audioElement && audioElement.duration > 0
        ? (audioElement.duration / secondsPerBox) * timelineBoxSize
        : 0;
};
