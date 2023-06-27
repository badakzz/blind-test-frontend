import axios from 'axios'
import { useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { csrfActions, getCSRFToken } from '../../store/csrfSlice'

export const useApiClient = () => {
    const { csrfToken } = useSelector((state: RootState) => state.csrf)

    const apiClient = axios.create({
        baseURL: `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1`,
        withCredentials: true,
    })

    apiClient.interceptors.request.use((config) => {
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken
        }
        return config
    })

    return apiClient
}

export default useApiClient
