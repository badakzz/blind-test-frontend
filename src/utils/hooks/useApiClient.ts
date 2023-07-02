import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'

export const useApiClient = () => {
    const csrfToken = useSelector((state: RootState) => state.csrf.csrfToken)

    const apiClient = axios.create({
        baseURL: `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1`,
        withCredentials: true,
        xsrfHeaderName: 'X-CSRF-TOKEN',
        xsrfCookieName: process.env.REACT_APP_CSRF_COOKIE_NAME,
        headers: { 'X-CSRF-TOKEN': csrfToken },
    })

    return apiClient
}

export default useApiClient
