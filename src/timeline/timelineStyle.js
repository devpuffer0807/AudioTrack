import {timelineConfig} from '../config';

const timelineTimeTrackerHeight = 25;

const timelineTimeTrackerGradientHeight = 10;

export const timelineScrollStyle = {
    width: timelineConfig.timelineBoxSize*timelineConfig.timelineMinBoxNumbers,
}

export const timelineTracklineStyle = {
    height: timelineConfig.timelineBoxSize,
    backgroundSize: timelineConfig.timelineBoxSize,
};

export const playHeadTopStyle = {
    height: timelineTimeTrackerHeight,
};
export const topTmpTrackerStyle = {
    height: timelineTimeTrackerHeight,
};
export const timelineTrackerStyle = {
    height: timelineTimeTrackerHeight,
    backgroundSize:
        timelineConfig.timelineBoxSize + "px" + " " + timelineTimeTrackerGradientHeight + "px",
};

export const timelineTimeValueStyle = {
    width: timelineConfig.timelineBoxSize,
}