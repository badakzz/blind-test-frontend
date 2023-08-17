import { Chatroom } from './../types/Chatroom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePlaylistManager = (
    playlistId: string,
    currentChatroom: Chatroom,
    trackPreviewList: any[],
    setTrackPreviewList: React.Dispatch<React.SetStateAction<any>>,
    isSearchSelection: boolean
) => {
    const [currentSongPlaying, setCurrentSongPlaying] = useState('')
    const [fetchError, setFetchError] = useState(null)
    const [playlistVersion, setPlaylistVersion] = useState<number>(0)

    const selectPlaylist = () => {
        setPlaylistVersion(playlistVersion + 1)
    }

    useEffect(() => {
        if (playlistId && !isSearchSelection) {
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
        } else if (playlistId && isSearchSelection) {
            const fetchPlaylistSongs = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/playlists/${playlistId}/tracks`,
                        { withCredentials: true }
                    )

                    const transformedData = response.data
                        .map((track) => ({
                            artist_name: track.artists[0].name,
                            song_name: track.name,
                            preview_url: track.preview_url,
                        }))
                        .filter(
                            (item) =>
                                item.preview_url &&
                                item.artist_name &&
                                item.song_name
                        )

                    setTrackPreviewList(transformedData)
                } catch (error) {
                    console.error(error)
                    setFetchError(error.response?.data?.error || error.message)
                }
            }

            fetchPlaylistSongs()
        }
    }, [playlistId, isSearchSelection, playlistVersion])

    return {
        trackPreviewList,
        currentSongPlaying,
        setCurrentSongPlaying,
        fetchError,
        selectPlaylist,
    }
}
