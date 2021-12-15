import { timelineConfig } from "../config";

export default ({event, container, config}) => {
    const { timelineBoxSize } = timelineConfig;
    const { secondsPerBox } = config;
    const bcr = container.current.getBoundingClientRect();
    const scrollLeft = container.current.scrollLeft;
    const currentX = scrollLeft + event.clientX - bcr.left
    return (currentX / timelineBoxSize) * secondsPerBox;
}