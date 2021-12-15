export const timelineConfig = {
    timelineBoxSize: 80,//px
    timelineMinBoxNumbers: 20,
}

export const playerConfig = {
    NUMBER_OF_BUCKETS: 800,
    SPACE_BETWEEN_BARS: (seconds) => {
        return timelineConfig.timelineBoxSize / seconds / 100
    },
}

export const randomColor = () => {
    let colors = [
        '#334155',
        '#374151',
        '#3F3F46',
        '#44403C',
        '#B91C1C',
        '#B45309',
        '#047857',
        '#4338CA',
        '#6D28D9',
        '#BE185D',
    ]

    return colors[Math.floor(Math.random() * colors.length)]
}

export const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        zIndex: '10'
    }
}
