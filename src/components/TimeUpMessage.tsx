import React from 'react'
import { Song } from '../utils/types'

interface TimeUpMessageProps {
    song: Song | null
}

const TimeUpMessage: React.FC<TimeUpMessageProps> = ({ song }) => {
    if (!song) {
        return null
    }

    return (
        <div className="text-center mt-4">
            Time's up! The answer was {song.songName} by {song.artistName}.
        </div>
    )
}

export default TimeUpMessage
