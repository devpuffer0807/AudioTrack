import { timelineConfig } from '../../config'

export default ({buffer, waveformWidth}) => {
    const SPACE_BETWEEN_BARS = (timelineConfig.timelineBoxSize * 0.02) / 100
    const numberOfBoxes = parseInt(waveformWidth / timelineConfig.timelineBoxSize)
    const NUMBER_OF_BUCKETS = numberOfBoxes * 30

    let svgRects = []
    let ukey = 0
    let decodedAudioData = buffer.getChannelData(0)
    let bucketDataSize = Math.floor(
        decodedAudioData.length / NUMBER_OF_BUCKETS
    )
    let buckets = []
    for (let i = 0; i < NUMBER_OF_BUCKETS; i++) {
        let startingPoint = i * bucketDataSize
        let endingPoint = i * bucketDataSize + bucketDataSize
        let max = 0
        for (let j = startingPoint; j < endingPoint; j++) {
            if (decodedAudioData[j] > max) {
                max = decodedAudioData[j]
            }
        }
        let size = Math.abs(max)
        if (size > 0) {
            buckets.push(size / 2)
        }
    }

    buckets.map((bucket, i) => {
        ukey++
        let bucketSVGWidth = 100.0 / buckets.length
        let bucketSVGHeight = bucket * 120.0 // 100.0 original height

        svgRects.push(
            <rect
                x={bucketSVGWidth * i + SPACE_BETWEEN_BARS / 2.0}
                y={(100 - bucketSVGHeight) / 2.0}
                width={bucketSVGWidth - SPACE_BETWEEN_BARS}
                height={bucketSVGHeight}
                key={ukey}
            />
        )
        return bucket
    })

    return svgRects
};
