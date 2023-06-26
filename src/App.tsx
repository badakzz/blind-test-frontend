import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Signup } from './components'
import { Layout } from './components'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser } from './store/authSlice'
import Cookies from 'js-cookie'

function App() {
    const [user, setUser] = useState<{ email: string; password: string }>()

    // const { token, isLoggedIn, user } = useSelector(
    //     (state: RootState) => state.auth
    // )

    if (!user) setUser(Cookies.get(process.env.REACT_APP_JWT_COOKIE_NAME))

    return (
        <Layout user={user}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </Layout>
    )
}

export default App
