import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const createApiClient = () => {
    const apiClient = axios.create({
        baseURL: `http://localhost:${process.env.REACT_APP_PORT}/api/v1`,
        withCredentials: true,
    })

    const { token } = useSelector((state: RootState) => state.auth)

    apiClient.interceptors.request.use((config) => {
        config.headers['X-XSRF-TOKEN'] = token
        return config
    })

    return apiClient
}

export default createApiClient
