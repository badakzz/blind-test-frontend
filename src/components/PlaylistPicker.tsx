import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import api from '../api'
import { Chatroom, Playlist } from '../utils/types'
import UsersInRoom from './UsersInRoom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { AuthState } from '../store/authSlice'
import _ from 'lodash'
import ReactSelect from 'react-select'

interface PlaylistPickerProps {
    currentChatroom: Chatroom
    show: boolean
    onHide: () => void
    onPlaylistSelected: (playlistId: string) => void
    isInRoom: boolean
    connectedUsers: string[]
    setIsSearchSelection: React.Dispatch<React.SetStateAction<any>>
    isSearchSelection: boolean
    selectPlaylist: () => void
}

const PlaylistPicker: React.FC<PlaylistPickerProps> = ({
    currentChatroom,
    show,
    onHide,
    onPlaylistSelected,
    isInRoom,
    connectedUsers,
    setIsSearchSelection,
    isSearchSelection,
    selectPlaylist,
}) => {
    const [playlistList, setPlaylistList] = useState<any>([])
    const [searchedList, setSearchedList] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [selectedPlaylist, setSelectedPlaylist] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [defaultSelectedPlaylist, setDefaultSelectedPlaylist] = useState('')

    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    const [selectButtonClicked, setSelectButtonClicked] = useState(
        user?.permissions !== 2
    )
    const initialState = {
        playlistList: [],
        searchedList: [],
        loading: false,
        selectedPlaylist: '',
        searchTerm: '',
        defaultSelectedPlaylist: '',
    }
    const [state, setState] = useState(initialState)

    useEffect(() => {
        setState(initialState)
    }, [])

    const options = searchedList.map((playlist: any) => ({
        value: playlist.id,
        label: playlist.name,
    }))

    const defaultOptions = playlistList.map((playlist: Playlist) => ({
        value: playlist.spotify_playlist_id,
        label: playlist.name,
    }))

    const handleSearchChangeDebounced = _.debounce(
        async (inputValue: string) => {
            setSearchTerm(inputValue)

            if (inputValue) {
                try {
                    const response = await api.get(
                        `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/playlists/search`,
                        {
                            params: { q: inputValue },
                            withCredentials: true,
                        }
                    )
                    setSearchedList(response.data)
                } catch (error) {
                    console.error('Error fetching searched playlists:', error)
                }
            }
        },
        200
    )

    useEffect(() => {
        const fetchPlaylistList = async () => {
            setLoading(true)

            try {
                const playlists = await api.get(
                    `${process.env.REACT_APP_SERVER_DOMAIN}/api/v1/playlists`
                )

                const uniquePlaylistList = playlists.data.reduce(
                    (acc: any, current: any) => {
                        const x = acc.find(
                            (item: any) =>
                                item.playlist_id === current.playlist_id
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
            } catch (error) {
                console.error('Error fetching playlists:', error)
            } finally {
                setLoading(false)
            }
        }
        if (selectButtonClicked) {
            fetchPlaylistList()
        }
    }, [selectButtonClicked])

    useEffect(() => {
        if (show) {
            setSelectedPlaylist('')
            setDefaultSelectedPlaylist('')
        }
    }, [show])

    const handlePlaylistChange = (option: any) => {
        setSelectedPlaylist(option.value)
        setIsSearchSelection(true)
    }

    const handleDefaultPlaylistChange = (selectedOption: any) => {
        setSelectedPlaylist(selectedOption.value)
        setIsSearchSelection(false)
    }

    const handleSubmit = () => {
        if (selectedPlaylist) {
            onPlaylistSelected(selectedPlaylist)
            onHide()
            selectPlaylist()
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
                    {user?.permissions === 2 ? (
                        <>
                            <div className="d-flex flex-row gap-3">
                                <Button
                                    className="green-button mb-3"
                                    onClick={() => {
                                        setSelectButtonClicked(true)
                                        setIsSearchSelection(false)
                                    }}
                                >
                                    Select default playlist
                                </Button>
                                <Button
                                    className="green-button mb-3"
                                    onClick={() => {
                                        setSelectButtonClicked(true)
                                        setIsSearchSelection(true)
                                    }}
                                >
                                    Search for any playlist
                                </Button>
                            </div>
                            {isSearchSelection ? (
                                <ReactSelect
                                    placeholder="Search for any playlist..."
                                    className="mb-3 playlist-select"
                                    options={
                                        options.length > 0
                                            ? options
                                            : [
                                                  {
                                                      value: '',
                                                      label: 'No result found',
                                                      isDisabled: true,
                                                  },
                                              ]
                                    }
                                    value={options.find(
                                        (option) =>
                                            option.value === selectedPlaylist
                                    )}
                                    onChange={handlePlaylistChange}
                                    onInputChange={handleSearchChangeDebounced}
                                    menuIsOpen={searchTerm !== ''}
                                />
                            ) : (
                                selectButtonClicked && (
                                    <ReactSelect
                                        placeholder="Select a default playlist..."
                                        className="mb-3 playlist-select"
                                        options={defaultOptions}
                                        value={defaultOptions.find(
                                            (option) =>
                                                option.value ===
                                                selectedPlaylist
                                        )}
                                        onChange={handleDefaultPlaylistChange}
                                    />
                                )
                            )}
                        </>
                    ) : (
                        <ReactSelect
                            placeholder="Select a default playlist..."
                            className="mb-3 playlist-select"
                            options={defaultOptions}
                            value={defaultOptions.find(
                                (option) => option.value === selectedPlaylist
                            )}
                            onChange={handleDefaultPlaylistChange}
                        />
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
                        disabled={
                            selectedPlaylist === '' &&
                            defaultSelectedPlaylist === ''
                        }
                    >
                        Submit
                    </Button>
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
