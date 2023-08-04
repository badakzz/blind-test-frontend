import { Chatroom } from './../types/Chatroom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { AuthState } from '../../store/authSlice'

export const usePlaylistManager = (
    playlistId: string,
    currentChatroom: Chatroom,
    trackPreviewList: any[],
    setTrackPreviewList: React.Dispatch<React.SetStateAction<any>>,
    isSearchSelection: boolean
) => {
    const [currentSongPlaying, setCurrentSongPlaying] = useState('')
    const [fetchError, setFetchError] = useState(null)

    const authUser = useSelector((state: RootState) => state.auth) as AuthState

    useEffect(() => {
        if (playlistId && !isSearchSelection) {
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
                    setFetchError(null)
                    const previews = response.data
                    console.log('previews', previews)
                    const previewList = previews.map((preview) => preview)
                    setTrackPreviewList(previewList)
                } catch (error) {
                    setFetchError(error.response?.data?.error || error.message)
                    console.error(error)
                }
            }
            fetchTrackPreviews()
        } else if (playlistId && isSearchSelection) {
            const fetchPlaylistSongs = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/playlists/${playlistId}/tracks`,
                        {
                            headers: {
                                Authorization: `Bearer ${authUser.token}`,
                            },
                        }
                    )
                    setTrackPreviewList(response.data)
                } catch (error) {
                    console.error(error)
                    setFetchError(error.response?.data?.error || error.message)
                }
            }
            fetchPlaylistSongs()
        }
    }, [playlistId, isSearchSelection])

    return {
        trackPreviewList,
        currentSongPlaying,
        setCurrentSongPlaying,
        fetchError,
    }
}
