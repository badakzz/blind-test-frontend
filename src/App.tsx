import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Signup, Layout, Chatroom } from './components'
import { RootState } from './store'
import { authActions, AuthState } from './store/authSlice'
import Cookies from 'js-cookie'
import { getCSRFToken } from './store/csrfSlice'

const App: React.FC = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getCSRFToken() as any)
    }, [dispatch])

    useEffect(() => {
        let user
        try {
            user = JSON.parse(
                Cookies.get(process.env.REACT_APP_AUTH_COOKIE_NAME)
            )
        } catch (e) {
            console.error('Parsing user cookie failed', e)
        }
        const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
        if (user) {
            dispatch(authActions.setUser(user))
            dispatch(authActions.setLoggedIn(true))
            dispatch(authActions.storeToken({ token }))
        }
    }, [dispatch])
    const user = useSelector((state: RootState) => state.auth) as AuthState
    console.log('app user', user)

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
