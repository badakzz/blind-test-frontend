import { useState, useEffect, useRef } from 'react'
import api from '../../api'

export const useAudioManager = (
    isGameOver,
    setIsTimeUp,
    socket,
    currentChatroom
) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [currentSongCredentials, setCurrentSongCredentials] = useState(null)
    const audioRef = useRef(new Audio()) // Initialize with an empty Audio object

    const fetchSongCredentials = async (songId) => {
        return await api.get(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/songs/credentials/${songId}`
        )
    }

    useEffect(() => {
        const handleAudioEnd = async () => {
            setIsTimeUp(true)
            socket.emit('audioEnded', currentChatroom.chatroomId)

            // Fetch song credentials once the song has ended
            const response = await fetchSongCredentials(
                currentSongCredentials.songId
            )
            if (response.status === 200) {
                setCurrentSongCredentials(response.data)
                console.log('aaa', response.data)
            } else {
                console.error('Error fetching song credentials', response)
            }
        }

        // Set up 'onended' event listener
        audioRef.current.onended = handleAudioEnd

        // Clean up
        return () => {
            audioRef.current.onended = null
        }
    }, [socket, currentChatroom, currentSongCredentials])

    const playTrack = (track, onEnded) => {
        console.log('track', track)
        if (track && track.preview_url) {
            // Only change the 'src' instead of creating a new audio object
            audioRef.current.src = track.preview_url

            setCurrentSongCredentials({ ...track, songId: track.song_id }) // Store song details including id

            audioRef.current.play().catch((e) => {
                console.log('Error playing audio', e)
            })

            console.log('song', track.song_name)
            console.log('artist', track.artist_name)

            setIsAudioPlaying(true)

            audioRef.current.onended = () => {
                onEnded()
            }

            console.log('track', track.song_id)
            return track.song_id
        } else {
            console.log('Invalid track or track.preview_url is not defined.')
            return null
        }
    }

    useEffect(() => {
        if (isGameOver && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = '' // Clear the audio source
            setIsAudioPlaying(false)
        }
    }, [isGameOver])

    return {
        audio: audioRef.current,
        playTrack,
        isAudioPlaying,
        setIsAudioPlaying,
        currentSongCredentials,
    }
}
