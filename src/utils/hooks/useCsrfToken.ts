import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCSRFToken = () => {
    const [csrfToken, setCSRFToken] = useState<string | null>(null)

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await axios.get('/api/auth/csrf', {
                    withCredentials: true,
                })
                const token = response.data.csrfToken
                setCSRFToken(token)
            } catch (error) {
                console.error('Failed to retrieve CSRF token', error)
            }
        }

        fetchToken()
    }, [])

    return csrfToken
}
