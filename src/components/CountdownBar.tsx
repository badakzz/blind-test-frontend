import React, { useEffect, useState, useRef } from 'react'
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
        setRemainingTime(duration)
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
            const delayNextTrackListener = () => {
                setRemainingTime(duration)
            }
            const artistAndSongNamesFoundListener = () => {
                setRemainingTime(duration)
            }

            socket.on('delayNextTrack', delayNextTrackListener)
            socket.on(
                'artistAndSongNamesFound',
                artistAndSongNamesFoundListener
            )

            return () => {
                socket.off('delayNextTrack', delayNextTrackListener)
                socket.off(
                    'artistAndSongNamesFound',
                    artistAndSongNamesFoundListener
                )
            }
        }
    }, [socket, duration])

    const percentage = (remainingTime / duration) * 100

    return (
        <div className="countdown-bar-container mt-2 mb-5">
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
