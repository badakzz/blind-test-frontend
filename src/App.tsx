import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Signup } from './components'
import { Layout } from './components'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/authSlice'
import Cookies from 'js-cookie'
import { getCSRFToken } from './store/csrfSlice'

const App: React.FC = () => {
    const dispatch = useDispatch()

    // useEffect(() => {
    //     dispatch(getCSRFToken() as any)
    // }, [dispatch])

    // useEffect(() => {
    //     const token = Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME)
    //     if (token) {
    //         dispatch(authActions.storeToken({ token }))
    //     }
    // }, [dispatch])

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Layout>
    )
}

export default App
