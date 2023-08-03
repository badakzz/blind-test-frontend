import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import api from '../api'
import { Chatroom, Playlist } from '../utils/types'
import UsersInRoom from './UsersInRoom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface PlaylistPickerProps {
    currentChatroom: Chatroom
    show: boolean
    onHide: () => void
    onPlaylistSelected: (playlistId: string) => void
    isGameOver: boolean
    isHost: boolean
    isInRoom: boolean
    resetGame: (chatroomId: string) => void
    connectedUsers: string[]
}

const PlaylistPicker: React.FC<PlaylistPickerProps> = ({
    currentChatroom,
    show,
    onHide,
    onPlaylistSelected,
    isGameOver,
    isHost,
    isInRoom,
    resetGame,
    connectedUsers,
}) => {
    const [playlistList, setPlaylistList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState('')

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

    useEffect(() => {
        setSelectedPlaylist('')
    }, [show])

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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentChatroom.chatroomId)
        toast('Room ID copied to clipboard!', {
            autoClose: 2000,
            hideProgressBar: true,
            position: 'bottom-center',
        })
    }

    return (
        <>
            {show && (
                <Container
                    className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
                    style={{ display: show ? 'block' : 'none' }}
                >
                    <h4 className="mb-3">Select a Playlist</h4>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Form.Select
                            className="mb-3 playlist-select"
                            value={selectedPlaylist}
                            onChange={handlePlaylistChange}
                        >
                            <option disabled value="">
                                Select a playlist...
                            </option>
                            {playlistList.map((playlist: Playlist) => (
                                <option
                                    key={playlist.playlist_id}
                                    value={playlist.spotify_playlist_id}
                                >
                                    {playlist.name}
                                </option>
                            ))}
                        </Form.Select>
                    )}
                    <p className="mb-5">
                        Chatroom created! Share this <a href={roomUrl}>link</a>{' '}
                        with others to join or click on the button below to copy
                        the room id to you clipboard.
                    </p>
                    <Button
                        className="green-button my-3"
                        onClick={copyToClipboard}
                    >
                        Copy room id
                    </Button>
                    <Button
                        className="green-button mb-3"
                        onClick={handleSubmit}
                        disabled={selectedPlaylist === ''}
                    >
                        Submit
                    </Button>
                    {isGameOver && isHost && (
                        <Button
                            onClick={() =>
                                resetGame(currentChatroom.chatroomId)
                            }
                        >
                            Play Again
                        </Button>
                    )}
                    {isInRoom && (
                        <UsersInRoom
                            className="users-connected-container"
                            upperClassName="users-connected-wrapper"
                            subClassName="text-align-center"
                            connectedUsers={connectedUsers}
                        />
                    )}
                </Container>
            )}
            <ToastContainer />
        </>
    )
}

export default PlaylistPicker
