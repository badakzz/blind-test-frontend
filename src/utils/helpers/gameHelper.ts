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
    if (trackPreviews[0] && trackPreviews[0]) {
        // Play the first track
        const newAudio = startPlayback(
            trackPreviews[0],
            trackPreviews,
            setCurrentSongIndex,
            isGameStopped,
            audio
        )
        return newAudio
    } else {
        console.error('Invalid first track')
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
        console.log('Playlist stopped')
        return null // don't play the next song if the game is stopped
    }

    if (!song || !song) {
        console.error('Invalid song or song is not defined.')
        return
    }

    audio.src = song
    audio.volume = 0.2
    audio.play().catch((error) => {
        console.error('Failed to play the track:', error)
    })
    audio.onerror = (error) => {
        console.error(
            'An error occurred while trying to play the audio:',
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
    return audio // Return the Audio object
}
