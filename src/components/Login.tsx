import React, { CSSProperties, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'
import { RootState } from '../store'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { isEmailValid } from '../utils/helpers'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')

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

    const handleEmailBlur = () => {
        if (email === '') {
            setEmailError('')
        } else if (!isEmailValid(email)) {
            setEmailError('Please enter a valid email')
        } else {
            setEmailError('')
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
            style={styles.container}
        >
            <h4>Login</h4>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        required
                    />
                    {emailError && <div className="text-red">{emailError}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <Button
                        className="green-button fw-bold my-5"
                        type="submit"
                        disabled={
                            loading || error || emailError
                                ? Object.values(emailError).some(Boolean)
                                : false || !email || !password
                        }
                    >
                        Login
                    </Button>
                </div>
            </Form>
            {error && <div className="text-red">{error}</div>}
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '20rem',
    },
}

export default Login
