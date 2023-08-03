import { useState, useEffect, useRef } from 'react'
import api from '../../api'

export const useAudioManager = (isGameOver, socket, currentChatroom) => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false)
    const [currentSongCredentials, setCurrentSongCredentials] = useState(null)
    const audioRef = useRef(new Audio())

    const fetchSongCredentials = async (songId) => {
        return await api.get(
            `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/songs/credentials/${songId}`
        )
    }

    useEffect(() => {
        const handleAudioEnd = async () => {
            setIsAudioPlaying(false)
            socket.emit('audioEnded', currentChatroom.chatroomId)

            const response = await fetchSongCredentials(
                currentSongCredentials.songId
            )
            if (response.status === 200) {
                setCurrentSongCredentials(response.data)
            } else {
                console.error('Error fetching song credentials', response)
            }
        }

        audioRef.current.onended = handleAudioEnd

        return () => {
            audioRef.current.onended = null
        }
    }, [socket, currentChatroom, currentSongCredentials])

    useEffect(() => {
        if (socket) {
            socket.off('artistAndSongNamesFound')

            socket.on('artistAndSongNamesFound', async () => {
                if (currentChatroom && currentChatroom.chatroomId) {
                    if (audioRef.current && audioRef.current instanceof Audio) {
                        audioRef.current.pause()
                        setIsAudioPlaying(false)
                        socket.emit('audioEnded', currentChatroom.chatroomId)
                    }
                }
                const response = await fetchSongCredentials(
                    currentSongCredentials.songId
                )
                if (response.status === 200) {
                    setCurrentSongCredentials(response.data)
                    socket.emit('songCredentialsUpdated', response.data)
                } else {
                    console.error('Error fetching song credentials', response)
                }
            })
        }
    }, [socket, currentSongCredentials])

    const playTrack = (track, onEnded) => {
        console.log('artist', track.artist_name)
        console.log('song', track.song_name)
        if (track && track.preview_url) {
            audioRef.current.src = track.preview_url
            audioRef.current.load()
            setCurrentSongCredentials({ ...track, songId: track.song_id })
            audioRef.current.oncanplay = () => {
                audioRef.current.play().catch((e) => {
                    console.error('Error playing audio', e)
                })
            }
            setIsAudioPlaying(true)
            audioRef.current.onended = () => {
                onEnded()
                setIsAudioPlaying(false)
            }
            return track.song_id
        } else {
            return null
        }
    }

    useEffect(() => {
        if (isGameOver && audioRef.current) {
            audioRef.current.pause()
            audioRef.current.src = ''
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
