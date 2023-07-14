import React, { CSSProperties, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import '../styles/CountdownBar.css'

interface CountdownBarProps {
    duration: number
    socket: Socket
}

const CountdownBar: React.FC<CountdownBarProps> = ({ duration, socket }) => {
    const [remainingTime, setRemainingTime] = useState(duration)

    useEffect(() => {
        setRemainingTime(duration) // reset the remaining time whenever duration changes
        const timerId = setInterval(() => {
            if (remainingTime > 0) {
                setRemainingTime((prevTime) => prevTime - 1)
            } else {
                clearInterval(timerId)
            }
        }, 1000)
        return () => clearInterval(timerId)
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
                    backgroundColor: 'green',
                }}
            />
        </div>
    )
}

export default CountdownBar
