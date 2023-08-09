import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {
    Home,
    Login,
    Signup,
    Layout,
    Chatroom,
    StripePaymentPage,
    Settings,
} from './components'
import { authActions } from './store/authSlice'
import Cookies from 'js-cookie'
import { getCSRFToken } from './store/csrfSlice'
import { redirectQueue } from './api'
import RoadmapTicketsList from './components/Roadmap'

const App: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getCSRFToken() as any)
    }, [dispatch])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (redirectQueue.length > 0) {
                const path = redirectQueue.shift()
                navigate(path)
            }
        }, 1000)

        return () => clearInterval(intervalId)
    }, [navigate])

    useEffect(() => {
        let user
        const userCookie = Cookies.get(process.env.REACT_APP_AUTH_COOKIE_NAME)
        if (userCookie) {
            try {
                user = JSON.parse(userCookie)
            } catch (e) {
                console.error('Parsing user cookie failed', e)
            }
        }
        console.log('appuser', user)
        const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
        console.log('apptoken', token)
        if (user) {
            dispatch(authActions.setUser(user))
            dispatch(authActions.setLoggedIn(true))
        }
        if (token) {
            console.log('dispatch token')
            dispatch(authActions.storeToken({ token }))
        }
    }, [dispatch])

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chatroom" element={<Chatroom />} />
                <Route path="/getpremium" element={<StripePaymentPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/roadmap" element={<RoadmapTicketsList />} />
            </Routes>
        </Layout>
    )
}

export default App
