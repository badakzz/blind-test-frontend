import axios from 'axios'

export const useApiClient = () => {
    const apiClient = axios.create({
        baseURL: `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1`,
        withCredentials: true,
    })
    console.log('defaults', apiClient.defaults)

    return apiClient
}

export default useApiClient
