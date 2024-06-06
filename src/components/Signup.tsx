import React, { CSSProperties, useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser, signupUser } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'
import { isEmailValid, isPasswordValid } from '../utils/helpers'
import { Button, Container, Form } from 'react-bootstrap'
import ReCAPTCHA from 'react-google-recaptcha'

const Signup: React.FC = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [captchaValue, setCaptchaValue] = useState<string | null>(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCaptchaChange = (value: string | null) => {
        setCaptchaValue(value)
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

    const handlePasswordBlur = () => {
        if (password === '') {
            setPasswordError('')
        } else if (!isPasswordValid(password)) {
            setPasswordError(
                'Password must be at least 12 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character'
            )
        } else {
            setPasswordError('')
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isEmailValid(email) && isPasswordValid(password)) {
            try {
                const action = await dispatch(
                    signupUser({
                        username: username,
                        email,
                        password,
                        captchaValue: captchaValue,
                    }) as any
                )
                if (signupUser.rejected.match(action)) {
                    throw new Error(action.payload as string)
                } else {
                    const credentials = { email, password, captchaValue }
                    await dispatch(loginUser(credentials) as any)
                    return navigate('/')
                }
            } catch (error) {
                setError(`Error occurred during signup: ${error.message}`)
                console.error(error)
            }
        } else {
            handleEmailBlur()
            handlePasswordBlur()
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
            style={styles.container}
        >
            <h4>Signup</h4>
            <Form onSubmit={handleSignup}>
                <Form.Group>
                    <Form.Label htmlFor="username">Username:</Form.Label>
                    <Form.Control
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="email">Email:</Form.Label>
                    <Form.Control
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        required
                        className="form-input"
                        autoComplete="new-password"
                    />
                    {emailError && <div className="text-red">{emailError}</div>}
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="password">Password:</Form.Label>
                    <Form.Control
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handlePasswordBlur}
                        required
                        className="form-input"
                        autoComplete="new-password"
                    />
                    {passwordError && (
                        <div className="text-red">{passwordError}</div>
                    )}
                </Form.Group>
                <Form.Group className="mt-3">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_GOOGLE_PUBLIC_KEY}
                        onChange={handleCaptchaChange}
                    />
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <Button
                        className="green-button fw-bold mt-5"
                        type="submit"
                        disabled={
                            passwordError
                                ? Object.values(passwordError).some(Boolean)
                                : false || emailError
                                ? Object.values(emailError).some(Boolean)
                                : false ||
                                  !username ||
                                  !email ||
                                  !password ||
                                  !captchaValue
                        }
                    >
                        Signup
                    </Button>
                </div>
            </Form>
            {error && <div className="text-red">{error}</div>}
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '25rem',
    },
}

export default Signup
