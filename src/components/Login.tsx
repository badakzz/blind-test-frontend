import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'
import { RootState } from '../store'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoggedIn, loading, error } = useSelector(
        (state: RootState) => state.auth
    )

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const credentials = { email, password }
        await dispatch(loginUser(credentials) as any)
        setEmail('')
        setPassword('')
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
