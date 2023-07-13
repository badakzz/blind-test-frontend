import React, { useEffect, useState } from 'react'
import '../styles/CountdownBar.css'

interface CountdownBarProps {
    duration: number
    isPlaying: boolean
}

const CountdownBar: React.FC<CountdownBarProps> = ({ duration, isPlaying }) => {
    const [remainingTime, setRemainingTime] = useState(duration)

    useEffect(() => {
        if (!isPlaying) {
            setRemainingTime(duration)
        } else {
            if (remainingTime <= 0) {
                setRemainingTime(duration) // reset the remaining time when the countdown ends
            } else {
                const timerId = setTimeout(() => {
                    setRemainingTime(remainingTime - 1)
                }, 1000)
                return () => clearTimeout(timerId)
            }
        }
    }, [remainingTime, isPlaying, duration])

    const percentage = (remainingTime / duration) * 100

    return (
        <div className="countdown-bar-container">
            <div
                className="countdown-bar"
                style={{ width: `${percentage}%` }}
            />
        </div>
    )
}

export default CountdownBar
