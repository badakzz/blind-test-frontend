import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePlaylistManager = (
    playlistId,
    currentChatroom,
    csrfToken,
    trackPreviewList,
    setTrackPreviewList
) => {
    const [currentSongPlaying, setCurrentSongPlaying] = useState('')

    useEffect(() => {
        if (playlistId) {
            const fetchTrackPreviews = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/songs/playlist/${playlistId}`,
                        {
                            params: {
                                numPreviews: 10,
                                chatroomId: currentChatroom.chatroomId,
                            },
                        }
                    )
                    const previews = response.data
                    const previewList = previews.map((preview) => preview)
                    setTrackPreviewList(previewList)
                } catch (error) {
                    console.error(error)
                }
            }
            fetchTrackPreviews()
        }
    }, [playlistId])

    return { trackPreviewList, currentSongPlaying, setCurrentSongPlaying }
}
