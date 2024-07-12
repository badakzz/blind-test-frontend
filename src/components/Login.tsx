import React, { CSSProperties, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'
import { RootState } from '../store'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Form } from 'react-bootstrap'
import { isEmailValid } from '../utils/helpers'
import ReCAPTCHA from 'react-google-recaptcha'
import { useToast } from '../utils/hooks'

const Login: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [captchaValue, setCaptchaValue] = useState<string | null>(null)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const { isLoggedIn, loading } = useSelector(
        (state: RootState) => state.auth
    )

    const handleCaptchaChange = (value: string | null) => {
        setCaptchaValue(value)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isEmailValid(email)) {
            const credentials = { email, password, captchaValue }
            try {
                const action = await dispatch(
                    await dispatch(loginUser(credentials) as any)
                )
                if (loginUser.rejected.match(action)) {
                    throw new Error(action.payload as string)
                } else {
                    const credentials = { email, password, captchaValue }
                    await dispatch(loginUser(credentials) as any)
                    return navigate('/')
                }
            } catch (error) {
                showToast({
                    message: `Error occurred during signup: ${error.message}`,
                })
            }
        } else {
            handleEmailBlur()
        }
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
                    <Form.Label htmlFor="email">Email:</Form.Label>
                    <Form.Control
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        required
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
                        required
                        className="form-input"
                    />
                </Form.Group>
                <Form.Group className="mt-3">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_GOOGLE_PUBLIC_KEY}
                        onChange={handleCaptchaChange}
                    />
                </Form.Group>
                <div className="d-flex justify-content-center">
                    <Button
                        className="green-button fw-bold my-5"
                        type="submit"
                        disabled={
                            loading || emailError
                                ? Object.values(emailError).some(Boolean)
                                : false || !email || !password || !captchaValue
                        }
                    >
                        Login
                    </Button>
                </div>
            </Form>
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '20rem',
    },
}

export default Login
