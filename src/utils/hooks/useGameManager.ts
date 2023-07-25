import { useState, useEffect } from 'react'

export const useGameManager = (socket, isHost) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [firstSong, setCurrentSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)

    const startGame = (trackPreviewList, chatroomId, isHost) => {
        if (trackPreviewList && trackPreviewList.length > 0 && isHost) {
            const firstSong = trackPreviewList[0]
            setCurrentSong(firstSong)
            socket.emit('startGame', {
                firstSong,
                trackPreviewList,
                chatroomId,
            })
            setGameStarted(true)
        }
    }

    useEffect(() => {
        if (socket) {
            if (!isHost) {
                socket.on('gameStarted', ({ firstSong, trackPreviewList }) => {
                    setCurrentSong(firstSong)
                    setGameStarted(true)
                })
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

    return { startGame, gameStarted, firstSong, isGameOver }
}
