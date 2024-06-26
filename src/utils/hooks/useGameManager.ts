import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'

export const useGameManager = (
    socket: Socket,
    setTrackPreviewList: React.Dispatch<React.SetStateAction<any>>,
    isHost: boolean,
    setShowPlaylistPicker: React.Dispatch<React.SetStateAction<any>>,
    setIsWaitingForHost: React.Dispatch<React.SetStateAction<any>>
) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [firstSong, setFirstSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)

    const startGame = (
        trackPreviewList: any[],
        chatroomId: string,
        isHost: boolean
    ) => {
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

    const resetGameState = () => {
        setGameStarted(false)
        setIsGameOver(false)
        setFirstSong(null)
        setShowPlaylistPicker(true)
        setTrackPreviewList(null)
    }

    const closeGame = () => {
        resetGameState()
        socket.disconnect()
    }

    const resetGame = (chatroomId: string) => {
        resetGameState()
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

    return {
        startGame,
        resetGame,
        closeGame,
        gameStarted,
        firstSong,
        isGameOver,
        setFirstSong,
    }
}
