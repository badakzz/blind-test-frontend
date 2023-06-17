import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SpotifyCallback = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // Extract the authorization code from the URL
        const code = new URLSearchParams(window.location.search).get('code')

        if (code) {
            // Exchange the authorization code for an access token
            // You'll need to make an API call to the Spotify token endpoint here
            // After successfully getting the access token, you can store it and redirect the user to the desired page

            // Example code to redirect to the desired page
            navigate('/')
        }
    }, [navigate])

    return (
        <div>
            {/* You can display a loading message or spinner while processing the authorization code */}
            Loading...
        </div>
    )
}

export default SpotifyCallback
