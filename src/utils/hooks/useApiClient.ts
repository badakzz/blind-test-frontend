import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const useApiClient = () => {
    const apiClient = axios.create({
        baseURL: `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/v1`,
        withCredentials: true,
    })

    const { csrfToken } = useSelector((state: RootState) => state.csrf)
    console.log('token', csrfToken)

    apiClient.interceptors.request.use((config) => {
        const url = config.baseURL + config.url // Get the complete URL
        console.log('Request URL:', url)
        config.headers['X-CSRF-TOKEN'] = csrfToken
        return config
    })

    return apiClient
}

export default useApiClient
