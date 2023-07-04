import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Playlist } from '../utils/types'

interface PlaylistSelectionModalProps {
    show: boolean
    onPlaylistSelected: (playlistId: string) => void
    onModalClose: () => void
}

const PlaylistSelectionModal: React.FC<PlaylistSelectionModalProps> = ({
    show,
    onPlaylistSelected,
    onModalClose,
}) => {
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)
    const [playlistList, setPlaylistList] = useState<any>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchPlaylistList = async () => {
            setLoading(true)
            const genres = await axios.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/genres`
            )
            const genreIdList = genres.data.map((genre: any) => genre.id)

            const promises = genreIdList.map((genreId: any) =>
                axios.get(
                    `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/playlists/${genreId}`
                )
            )

            const playlistListByGenre = await Promise.all(promises)

            const playlistList = playlistListByGenre.reduce(
                (acc: any, playlistList: any) => {
                    return playlistList
                        ? acc.concat(
                              playlistList.data.filter(
                                  (item: any) => item !== null
                              )
                          )
                        : acc
                },
                []
            )

            // Remove duplicates
            const uniquePlaylistList = playlistList.reduce(
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
        setSelectedPlaylistId(event.target.value)
    }

    const handleSubmit = () => {
        if (selectedPlaylistId) {
            onPlaylistSelected(selectedPlaylistId)
            onModalClose()
        }
    }

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
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onModalClose}>Close</button>
            </div>
        </div>
    )
}

export default PlaylistSelectionModal
