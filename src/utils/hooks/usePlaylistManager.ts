import { Chatroom } from './../types/Chatroom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePlaylistManager = (
    playlistId: string,
    currentChatroom: Chatroom,
    trackPreviewList: any[],
    setTrackPreviewList: React.Dispatch<React.SetStateAction<any>>,
    isSearchSelection: boolean,
    isPremiumPlaylistSelected: boolean
) => {
    const [currentSongPlaying, setCurrentSongPlaying] = useState('')
    const [fetchError, setFetchError] = useState(null)
    const [playlistVersion, setPlaylistVersion] = useState<number>(0)

    const selectPlaylist = () => {
        setPlaylistVersion(playlistVersion + 1)
    }

    useEffect(() => {
        if (playlistId) {
            const fetchTrackPreviews = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/songs/playlist/${playlistId}`,
                        {
                            params: {
                                numPreviews: 10,
                                chatroomId: currentChatroom.chatroomId,
                            },
                        }
                    )
                    setFetchError(null)
                    const previews = response.data
                    const previewList = previews.map((preview) => preview)
                    setTrackPreviewList(previewList)
                } catch (error) {
                    setFetchError(error.response?.data?.error || error.message)
                    console.error(error)
                }
            }
            fetchTrackPreviews()
        }
    }, [playlistId, playlistVersion])

    return {
        trackPreviewList,
        currentSongPlaying,
        setCurrentSongPlaying,
        fetchError,
        selectPlaylist,
    }
}
