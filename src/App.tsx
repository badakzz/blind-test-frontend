import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Signup, Layout, Chatroom } from './components'
import { RootState } from './store'
import { authActions, AuthState } from './store/authSlice'
import Cookies from 'js-cookie'
import { csrfActions, getCSRFToken } from './store/csrfSlice'

const App: React.FC = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCSRFToken() as any)
    }, [dispatch])

    useEffect(() => {
        const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
        if (token) {
            dispatch(authActions.storeToken({ token }))
        }
    }, [dispatch])

    useEffect(() => {
        const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
        if (token) {
            dispatch(authActions.storeToken({ token }))
        }

        // Load user data from localStorage
        let user = localStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            dispatch(authActions.setUser(user))
            dispatch(authActions.setLoggedIn(true))
        }
    }, [dispatch])
    const user = useSelector((state: RootState) => state.auth) as AuthState
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/chatroom"
                    element={<Chatroom user={user.user} />}
                />
            </Routes>
        </Layout>
    )
}

export default App
