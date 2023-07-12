import React from 'react'

type Props = {
    connectedUsers: string[]
}

const UsersInRoom: React.FC<Props> = ({ connectedUsers }) => {
    return (
        <div>Users online: {connectedUsers.map((user) => user).join(', ')}</div>
    )
}

export default UsersInRoom
