import React, { CSSProperties, useEffect, useState, useRef } from 'react'
import { Socket } from 'socket.io-client'
import '../styles/CountdownBar.css'

interface CountdownBarProps {
    duration: number
    socket: Socket
    color: string
}

const CountdownBar: React.FC<CountdownBarProps> = ({
    duration,
    socket,
    color,
}) => {
    const [remainingTime, setRemainingTime] = useState(duration)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setRemainingTime(duration) // reset the remaining time whenever duration changes
        intervalRef.current = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1
                } else {
                    clearInterval(intervalRef.current as NodeJS.Timeout)
                    return prevTime
                }
            })
        }, 1000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [duration])

    useEffect(() => {
        if (socket) {
            socket.off('delayNextTrack')
            socket.on('delayNextTrack', () => {
                setRemainingTime(duration) // reset the remaining time to the full song duration
            })
        }
    }, [socket, duration])

    const percentage = (remainingTime / duration) * 100

    return (
        <div className="countdown-bar-container">
            <div
                className="countdown-bar"
                style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                }}
            />
        </div>
    )
}

export default CountdownBar
