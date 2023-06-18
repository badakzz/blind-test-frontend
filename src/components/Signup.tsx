import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signupUser } from '../store/authSlice'

const Signup: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const handleSignupOld = async (e) => {
    //     e.preventDefault()
    //     try {
    //         const response = await apiClient.post(
    //             `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/auth/signup`,
    //             {
    //                 user_name: username,
    //                 email,
    //                 password,
    //             },
    //             { withCredentials: true }
    //         )
    //         const { token } = response.data
    //         storeToken(token) // Dispatch the action to store the token in Redux state
    //         navigate('/')
    //     } catch (error) {
    //         setError(
    //             `Error occurred during signup: ${error.response.data.error}`
    //         )
    //         console.error(error)
    //     }
    // }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const action = await dispatch(
                signupUser({ user_name: username, email, password }) as any
            )
            if (signupUser.rejected.match(action)) {
                throw new Error(action.payload as string)
            }

            navigate('/')
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
function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
