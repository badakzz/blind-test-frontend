import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePlaylistManager = (
    playlistId,
    currentChatroom,
    csrfToken,
    socket
) => {
    const [trackPreviewList, setTrackPreviewList] = useState([])
    const [currentSongPlaying, setCurrentSongPlaying] = useState('')

    useEffect(() => {
        if (playlistId) {
            const fetchTrackPreviews = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/tracks/${playlistId}`,
                        {
                            params: {
                                numPreviews: 10,
                                chatroomId: currentChatroom.chatroomId,
                            },
                        }
                    )
                    const previews = response.data
                    const previewList = previews.map((preview) => preview)
                    console.log('previewList', previewList)
                    setTrackPreviewList(previewList)
                } catch (error) {
                    console.error(error)
                }
            }
            fetchTrackPreviews()
        }
    }, [playlistId])

    useEffect(() => {
        if (currentSongPlaying && currentChatroom) {
            const updateCurrentSongPlaying = async () => {
                try {
                    const response = await axios.put(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/chatrooms/${currentChatroom.chatroomId}/current_song_playing_id`,
                        { chatroom_current_song_id: currentSongPlaying },
                        {
                            headers: {
                                'X-CSRF-TOKEN': csrfToken,
                            },
                            withCredentials: true,
                        }
                    )
                    if (response.status !== 200) {
                        console.error(
                            'Failed to update the current song playing'
                        )
                    }
                } catch (error) {
                    console.error(
                        'An error occurred while updating the current song playing',
                        error
                    )
                }
            }
            updateCurrentSongPlaying()
        }
    }, [currentSongPlaying, currentChatroom, csrfToken])

    useEffect(() => {
        if (socket) {
            socket.on('gameStarted', ({ trackPreviewList }) => {
                setTrackPreviewList(trackPreviewList) // Update trackPreviewList on 'gameStarted'
            })

            return () => {
                socket.off('gameStarted')
            }
        }
    }, [socket])

    return { trackPreviewList, currentSongPlaying, setCurrentSongPlaying }
}
