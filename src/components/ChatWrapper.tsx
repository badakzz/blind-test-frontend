import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TrackPreviewContext } from '../utils/context/TrackPreviewContext'

const ChatroomWrapper = ({ user }) => {
    const [trackPreviewList, setTrackPreviewList] = useState([])

    return (
        <TrackPreviewContext.Provider
            value={{ trackPreviewList, setTrackPreviewList }}
        >
            <Outlet />
        </TrackPreviewContext.Provider>
    )
}

export default ChatroomWrapper
