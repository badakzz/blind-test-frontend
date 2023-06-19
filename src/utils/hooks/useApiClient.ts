import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { getCSRFToken } from '../../store/csrfSlice'

export const useApiClient = () => {
    const apiClient = axios.create({
        baseURL: `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1`,
        withCredentials: true,
    })

    const { csrfToken } = useSelector((state: RootState) => state.csrf)
    const dispatch = useDispatch()

    if (!csrfToken) {
        dispatch(getCSRFToken() as any)
    }

    apiClient.interceptors.request.use((config) => {
        const url = config.baseURL + config.url // Get the complete URL
        config.headers['X-CSRF-TOKEN'] = csrfToken
        return config
    })

    return apiClient
}

export default useApiClient
