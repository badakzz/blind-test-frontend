export type ChatMessage = {
    chatMessageId: number
    chatroomId: string
    userId: number
    author: string
    content: string
    isFlagged?: boolean
    reporterId?: string
}
