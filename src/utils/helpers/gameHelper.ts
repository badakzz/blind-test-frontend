export const startGame = async (
    setGameStarted,
    trackPreviews,
    startPlayback,
    setCurrentSongIndex,
    isGameStopped,
    audio
) => {
    setGameStarted(true)
    // Check if the first track and its previewUrl are not null or undefined
    console.log({ 1: trackPreviews[0] })
    // remove all .preview_url
    if (trackPreviews[0] && trackPreviews[0]) {
        // Play the first track
        const { audio: newAudio, currentSongId } = startPlayback(
            trackPreviews[0],
            trackPreviews,
            setCurrentSongIndex,
            isGameStopped,
            audio
        )
        // if (newAudio) {
        // }
        return
        // { audio: newAudio, currentSongId }
    } else {
        console.error(
            "Invalid first track or track.preview_url is not defined."
        )
        return null
    }
}

export const startPlayback = (
    song,
    trackPreviews,
    setCurrentSongIndex,
    isGameStopped,
    audio
) => {
    if (isGameStopped) {
        console.log("Playlist stopped")
        return null // don't play the next song if the game is stopped
    }
    console.log("song", song.artist_name)
    console.log("song", song.song_name)

    if (!song || !song.preview_url) {
        console.error("Invalid song or song.preview_url is not defined.")
        return
    }

    audio.src = song.preview_url
    audio.volume = 0.2
    audio.play().catch((error) => {
        console.error("Failed to play the track:", error)
    })
    audio.onerror = (error) => {
        console.error(
            "An error occurred while trying to play the audio:",
            error
        )
    }
    // When the track ends, play the next one (if there are any left)
    audio.onended = () => {
        setCurrentSongIndex((prevIndex) => {
            const nextIndex = prevIndex + 1

            // Stop after 10 tracks
            if (nextIndex < 10 && trackPreviews[nextIndex]) {
                // Wait for 5 seconds before playing the next track
                setTimeout(() => {
                    startPlayback(
                        trackPreviews[nextIndex],
                        trackPreviews,
                        setCurrentSongIndex,
                        isGameStopped,
                        audio
                    )
                }, 5000)
            } else {
                // Game is over, handle this as needed
            }

            return nextIndex
        })
    }

    return
    // {
    //     audio: audio || "default audio value",
    //     currentSongId: song.song_id || "default songId value",
    // } // Return the Audio object and the song id
}
