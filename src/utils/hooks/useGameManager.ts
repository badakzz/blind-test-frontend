import { useState, useEffect } from 'react'

export const useGameManager = (
    socket,
    setTrackPreviewList,
    isHost,
    setShowModalPlaylistSelection,
    setIsWaitingForHost
) => {
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

    const resetGame = (chatroomId) => {
        setGameStarted(false)
        setIsGameOver(false)
        setFirstSong(null)
        setShowModalPlaylistSelection(true)
        setTrackPreviewList(null)
        socket.emit('resetGame', { chatroomId })
    }

    useEffect(() => {
        if (socket && !isHost) {
            socket.on('gameReset', () => {
                setGameStarted(false)
                setIsGameOver(false)
                setFirstSong(null)
                setIsWaitingForHost(true)
                setTrackPreviewList(null)
            })
            return () => {
                socket.off('gameReset')
            }
        }
    }, [socket, isHost])

    useEffect(() => {
        if (socket) {
            if (!isHost) {
                socket.on('gameStarted', ({ firstSong, trackPreviewList }) => {
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

    return { startGame, resetGame, gameStarted, firstSong, isGameOver }
}
