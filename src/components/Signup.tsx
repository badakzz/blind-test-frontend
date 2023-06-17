import React, { useState } from 'react'
import axios from 'axios'
import { redirect } from 'react-router-dom'

const Signup: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/auth/signup`,
                {
                    user_name: username,
                    email,
                    password,
                },
                { withCredentials: true }
            )
            const { token } = response.data
            // Store the token in localStorage or a state management solution
            // Redirect the user or update the UI based on the successful signup
        } catch (error) {
            setError(
                `Error occurred during signup: ${error.response.data.error}`
            )
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
