import { useState, useEffect } from "react"

export const useAudioManager = (isGameOver) => {
    const [audio, setAudio] = useState(null)

    const playTrack = (track, onEnded) => {
        if (track && track.preview_url) {
            const newAudio = new Audio(track.preview_url)
            newAudio.onended = onEnded // Call the callback when the audio ends.
            if (newAudio && newAudio instanceof Audio) {
                console.log("song", track.song_name)
                console.log("artist", track.artist_name)
                newAudio.play().catch((e) => {
                    console.log("Error playing audio", e)
                })
            }
            setAudio(newAudio)
            return track.song_id
        } else {
            console.log("Invalid track or track.preview_url is not defined.")
            return null
        }
    }
    useEffect(() => {
        if (isGameOver && audio && audio instanceof Audio) {
            audio.pause()
        }
    }, [isGameOver, audio])

    return { audio, playTrack }
}
