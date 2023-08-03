import React from 'react'

type Props = {
    connectedUsers: string[]
    [key: string]: any
}

const UsersInRoom: React.FC<Props> = ({ connectedUsers, ...restOfProps }) => {
    return (
        <div {...restOfProps}>
            Users online: {connectedUsers.map((user) => user).join(', ')}
        </div>
    )
}

export default UsersInRoom
