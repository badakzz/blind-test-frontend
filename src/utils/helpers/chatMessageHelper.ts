export function normalizeChatMessage(chatMessage) {
    // Remove all non-alphanumeric characters (except for spaces and dashes)
    chatMessage = chatMessage.toLowerCase().replace(/[^\w\s-]/gi, '')

    // Remove words in parentheses
    chatMessage = chatMessage.replace(/ *\([^)]*\) */g, ' ')

    // If there's a dash in the song name, only keep what's after the dash
    if (chatMessage.includes('-')) {
        chatMessage = chatMessage.substring(chatMessage.indexOf('-') + 1)
    }

    // If the chatMessage starts with a number, remove it (and the following space)
    chatMessage = chatMessage.replace(/^\d+\s/, '')

    // If there's a "feat" in the song name, only keep what's before "feat"
    if (chatMessage.includes('feat')) {
        chatMessage = chatMessage.substring(0, chatMessage.indexOf('feat'))
    }

    // Remove multiple spaces
    chatMessage = chatMessage.replace(/\s+/g, ' ').trim()

    return chatMessage
}
