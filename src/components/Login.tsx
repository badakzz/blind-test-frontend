import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'
import { RootState } from '../store'
import { redirect } from 'react-router-dom'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch()
    const { isLoggedIn, loading } = useSelector(
        (state: RootState) => state.auth
    )

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await dispatch(loginUser({ email, password }) as any)
            return redirect('/')
        } catch (error) {
            setError('Invalid email or password')
        }
    }

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
