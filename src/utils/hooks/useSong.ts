import { useState, useEffect } from "react"

export const useSong = (socket) => {
    const [song, setSong] = useState(null)

    useEffect(() => {
        socket.on("newSong", (song) => {
            setSong(song)
        })

        socket.on("gameOver", () => {
            if (song) {
                setSong({
                    ...song,
                    playing: false,
                })
            }
        })

        socket.on("updateSong", (updatedSong) => {
            setSong(updatedSong)
        })

        return () => {
            socket.off("newSong")
            socket.off("gameOver")
            socket.off("updateSong")
        }
    }, [socket, song])

    return song
}
