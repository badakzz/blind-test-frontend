// components/PlaylistSelectionModal.tsx
import axios from 'axios'
import React, { useEffect, useState } from 'react'

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

    useEffect(() => {
        const fetchPlaylists = async () => {
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
                (acc: any, playlists: any) => {
                    return playlists
                        ? acc.concat(
                              playlists.data.filter(
                                  (item: any) => item !== null
                              )
                          )
                        : acc
                },
                []
            )

            // Remove duplicates
            const uniquePlaylistList = Array.from(
                new Set(playlistList.map((playlist: any) => playlist.id))
            ).map((id) => {
                return playlistList.find((playlist: any) => playlist.id === id)
            })

            setPlaylistList(uniquePlaylistList)
        }

        fetchPlaylists()
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
                <select onChange={handlePlaylistChange}>
                    {playlistList.map((playlist: any) => (
                        <option key={playlist.id} value={playlist.id}>
                            {playlist.name}
                        </option>
                    ))}
                </select>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onModalClose}>Close</button>
            </div>
        </div>
    )
}

export default PlaylistSelectionModal
