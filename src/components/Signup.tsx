import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser, signupUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

const Signup: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const action = await dispatch(
                signupUser({ username: username, email, password }) as any
            )
            if (signupUser.rejected.match(action)) {
                throw new Error(action.payload as string)
            } else {
                const credentials = { email, password }
                await dispatch(loginUser(credentials) as any)
                return navigate('/')
            }
        } catch (error) {
            setError(`Error occurred during signup: ${error.message}`)
            console.error(error)
        }
    }

    return (
        <div>
            <h2>Signup</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSignup}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default Signup
