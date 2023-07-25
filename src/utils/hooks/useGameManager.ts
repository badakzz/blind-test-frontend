import { first } from 'lodash'
import { useState, useEffect } from 'react'

export const useGameManager = (socket, setTrackPreviewList, isHost) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [firstSong, setFirstSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)

    const startGame = (trackPreviewList, chatroomId, isHost) => {
        if (trackPreviewList && trackPreviewList.length > 0 && isHost) {
            const firstSong = trackPreviewList[0]
            setFirstSong(firstSong)
            socket.emit('startGame', {
                chatroomId,
                firstSong,
                trackPreviewList,
            })
            setGameStarted(true)
        }
    }

    useEffect(() => {
        if (socket) {
            if (!isHost) {
                socket.on('gameStarted', ({ firstSong, trackPreviewList }) => {
                    console.log('gamestart', firstSong, trackPreviewList)
                    setFirstSong(firstSong)
                    setTrackPreviewList(trackPreviewList)
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
