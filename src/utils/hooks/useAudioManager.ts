import { useState, useEffect } from 'react'

export const useAudioManager = (
    isGameOver,
    setIsTimeUp,
    socket,
    currentChatroom
) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [audio, setAudio] = useState<HTMLAudioElement>(null)

    const playTrack = (track, onEnded) => {
        if (track && track.preview_url) {
            const newAudio = new Audio(track.preview_url)
            newAudio.onended = () => {
                setIsTimeUp(true)
                socket.emit('audioEnded', currentChatroom.chatroomId)
                onEnded()
            }
            if (newAudio && newAudio instanceof Audio) {
                console.log('song', track.song_name)
                console.log('artist', track.artist_name)
                newAudio.play().catch((e) => {
                    console.log('Error playing audio', e)
                })
            }
            setAudio(newAudio)
            setIsAudioPlaying(true)
            return track.song_id
        } else {
            console.log('Invalid track or track.preview_url is not defined.')
            return null
        }
    }

    useEffect(() => {
        if (isGameOver && audio && audio instanceof Audio) {
            audio.pause()
            audio.src = '' // Clear the audio source
            setAudio(null)
            setIsAudioPlaying(false)
        }
    }, [isGameOver, audio])

    return { audio, playTrack, isAudioPlaying, setIsAudioPlaying }
}
