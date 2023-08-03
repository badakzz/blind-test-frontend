import React from 'react'

type Props = {
    connectedUsers: string[]
    upperClassName: string
    subClassName: string
    className: string
    [key: string]: any
}

const UsersInRoom: React.FC<Props> = ({
    connectedUsers,
    upperClassName,
    subClassName,
    className,
}) => {
    return (
        <div className={upperClassName}>
            <div className={subClassName}>Users online:</div>
            <div className={className}>
                {connectedUsers.map((user) => user).join('\n')}
            </div>
        </div>
    )
}

export default UsersInRoom
