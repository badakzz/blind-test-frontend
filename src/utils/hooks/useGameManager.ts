import { useState, useEffect } from 'react'

export const useGameManager = (socket, isHost) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [currentSong, setCurrentSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)

    const startGame = (trackPreviewList, chatroomId, isHost) => {
        if (trackPreviewList && trackPreviewList.length > 0 && isHost) {
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

    useEffect(() => {
        if (socket) {
            if (!isHost) {
                socket.on(
                    'gameStarted',
                    ({ currentSong, trackPreviewList }) => {
                        setCurrentSong(currentSong)
                        setGameStarted(true)
                    }
                )
            }
            socket.on('gameOver', () => {
                setIsGameOver(true)
            })

            return () => {
                socket.off('gameStarted')
                socket.off('gameOver')
            }
        }
    }, [socket, isHost])

    return { startGame, gameStarted, currentSong, isGameOver }
}
