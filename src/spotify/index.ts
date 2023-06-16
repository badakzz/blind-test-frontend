import axios from "axios"

// const dotenv = require("dotenv")
// dotenv.config({ path: "./env/local.env" })

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

let accessToken = ""

export const getAccessToken = async () => {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        null,
        {
            params: {
                grant_type: "client_credentials",
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${clientId}:${clientSecret}`
                ).toString("base64")}`,
            },
        }
    )

    accessToken = response.data.access_token
}

export const getAvailableGenres = async (country = "US", locale = "en_US") => {
    if (!accessToken) {
        await getAccessToken()
    }

    const response = await axios.get(
        "https://api.spotify.com/v1/browse/categories",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                country: country,
                locale: locale,
            },
        }
    )

    return response.data.categories.items
}

export const getPlaylistsByGenre = async (
    genreId,
    country = "US",
    locale = "en_US"
) => {
    if (!accessToken) {
        await getAccessToken()
    }

    const response = await axios.get(
        `https://api.spotify.com/v1/browse/categories/${genreId}/playlists`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                country: country,
                locale: locale,
            },
        }
    )

    return response.data.playlists.items
}

export const getMultipleRandomTrackPreviewsFromPlaylist = async (
    playlistId,
    numPreviews
) => {
    if (!accessToken) {
        await getAccessToken()
    }

    const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    const tracksWithPreview = response.data.items.filter(
        (item) => item.track.preview_url
    )

    if (tracksWithPreview.length === 0) {
        throw new Error("No tracks with previews found in the playlist.")
    }

    const previews = []
    for (let i = 0; i < numPreviews; i++) {
        const randomTrack =
            tracksWithPreview[
                Math.floor(Math.random() * tracksWithPreview.length)
            ]
        previews.push({
            previewUrl: randomTrack.track.preview_url,
            name: randomTrack.track.name,
            artist: randomTrack.track.artists[0].name,
        })
    }

    return previews
}

// add error gestion for token expiration
