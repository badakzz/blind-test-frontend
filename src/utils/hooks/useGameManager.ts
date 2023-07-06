import React from 'react'
import { useState, useEffect } from 'react'
import { TrackPreviewContext } from '../context/TrackPreviewContext'

export const useGameManager = (socket, isHost) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [currentSong, setCurrentSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)
    const { setTrackPreviewList } = React.useContext(TrackPreviewContext)

    const startGame = (trackPreviewList, chatroomId) => {
        if (trackPreviewList && trackPreviewList.length > 0) {
            const currentSong = trackPreviewList[0]
            setCurrentSong(currentSong)
            socket.emit('startGame', {
                currentSong,
                trackPreviewList,
                chatroomId,
            })
            setGameStarted(true)
        }
    }

    const endGame = () => {
        setIsGameOver(true)
        socket.emit('gameOver')
    }

    useEffect(() => {
        if (socket && !isHost) {
            console.log('test')
            socket.on('gameStarted', ({ currentSong, trackPreviewList }) => {
                console.log('currentSong', currentSong)
                setCurrentSong(currentSong)
                setTrackPreviewList(trackPreviewList)
            })

            socket.on('gameOver', () => {
                setIsGameOver(true)
            })

            return () => {
                socket.off('gameStarted')
                socket.off('gameOver')
            }
        }
    }, [socket, isHost]) // Added setTrackPreviewList as dependency

    return { startGame, endGame, gameStarted, currentSong, isGameOver }
}
