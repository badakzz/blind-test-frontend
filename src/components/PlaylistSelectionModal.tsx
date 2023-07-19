import axios from 'axios'
import React, { useEffect, useState } from 'react'
import api from '../api'
import { Chatroom, Playlist } from '../utils/types'

interface PlaylistSelectionModalProps {
    currentChatroom: Chatroom
    show: boolean
    onHide: () => void
    onPlaylistSelected: (playlistId: string) => void
}

const PlaylistSelectionModal: React.FC<PlaylistSelectionModalProps> = ({
    currentChatroom,
    show,
    onHide,
    onPlaylistSelected,
}) => {
    const [playlistList, setPlaylistList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)

    useEffect(() => {
        const fetchPlaylistList = async () => {
            setLoading(true)

            const playlists = await api.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/playlists`
            )

            const uniquePlaylistList = playlists.data.reduce(
                (acc: any, current: any) => {
                    const x = acc.find(
                        (item: any) => item.playlist_id === current.playlist_id
                    )
                    if (!x) {
                        return acc.concat([current])
                    } else {
                        return acc
                    }
                },
                []
            )

            setPlaylistList(uniquePlaylistList)
            setLoading(false)
        }

        fetchPlaylistList()
    }, [])

    const handlePlaylistChange = (event: any) => {
        setSelectedPlaylist(event.target.value)
    }

    const handleSubmit = () => {
        if (selectedPlaylist) {
            onPlaylistSelected(selectedPlaylist)
            onHide()
        }
    }

    const currentUrl = window.location.href
    const roomUrl = `${currentUrl}?chatroomId=${currentChatroom.chatroomId}`

    return (
        <div style={{ display: show ? 'block' : 'none' }}>
            <div>
                <h2>Select a Playlist</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <select onChange={handlePlaylistChange}>
                        {playlistList.map((playlist: Playlist) => {
                            return (
                                <option
                                    key={playlist.playlist_id}
                                    value={playlist.spotify_playlist_id}
                                >
                                    {playlist.name}
                                </option>
                            )
                        })}
                    </select>
                )}
                <div>
                    Chatroom created! Share this link with others to join:{' '}
                    {roomUrl}
                </div>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onHide}>Close</button>
            </div>
        </div>
    )
}

export default PlaylistSelectionModal
