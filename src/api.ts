import axios from 'axios'

const redirectQueue = [] // This array holds all the redirect paths.

const api = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}`,
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            redirectQueue.push('/login') // If the error is 401, push the path to the queue
        }
        return Promise.reject(error)
    }
)

export { redirectQueue }
export default api
