import { useState, useEffect } from "react"

export const useGameManager = (socket) => {
    const [gameStarted, setGameStarted] = useState(false)
    const [currentSong, setCurrentSong] = useState(null)
    const [isGameOver, setIsGameOver] = useState(false)

    const startGame = (trackPreviewList) => {
        if (trackPreviewList && trackPreviewList.length > 0) {
            const currentSong = trackPreviewList[0]
            setCurrentSong(currentSong)
            socket.emit("startGame", {
                currentSong, // Send the whole song object, not just the ID
                trackPreviewList,
            })
            setGameStarted(true)
        }
    }

    const endGame = () => {
        setIsGameOver(true)
        socket.emit("gameOver")
    }

    useEffect(() => {
        if (socket) {
            socket.on("gameStarted", ({ currentSong, trackPreviewList }) => {
                // Expect a song object, not an ID
                console.log("currentSong", currentSong)
                setCurrentSong(currentSong)
            })

            socket.on("gameOver", () => {
                setIsGameOver(true)
            })

            return () => {
                socket.off("gameStarted")
                socket.off("gameOver")
            }
        }
    }, [socket])

    return { startGame, endGame, gameStarted, currentSong, isGameOver }
}
