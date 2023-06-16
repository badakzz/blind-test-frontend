export type ChatMessage = {
    chat_message_id: number
    chatroom_id: string
    user_id: number
    content: string
    is_flagged?: boolean
    reporter_id?: string
}
