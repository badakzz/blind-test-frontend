import React, { CSSProperties, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, updateSettings } from '../store/authSlice'
import { RootState } from '../store'
import { isEmailValid, isPasswordValid } from '../utils/helpers'
import { Button, Container, Form } from 'react-bootstrap'

const Settings: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState('')

    const dispatch = useDispatch()
    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            dispatch(
                updateSettings({
                    userId: user.userId,
                    email: email,
                    password: password,
                }) as any
            )
        } catch (err) {
            setError(err)
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

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 grey-container"
            style={styles.container}
        >
            <h4>Settings</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>New email:</Form.Label>
                    <Form.Control
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input mb-3"
                        onBlur={handleEmailBlur}
                    />
                </Form.Group>
                {emailError && <div className="text-red">{emailError}</div>}
                <Form.Group>
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        onBlur={handlePasswordBlur}
                    />
                </Form.Group>
                {passwordError && (
                    <div className="text-red">{passwordError}</div>
                )}
                <div className="d-flex justify-content-center">
                    <Button
                        className="green-button fw-bold my-5"
                        type="submit"
                        disabled={
                            passwordError
                                ? Object.values(passwordError).some(Boolean)
                                : false || emailError
                                ? Object.values(emailError).some(Boolean)
                                : false || (!email && !password)
                        }
                    >
                        Update your settings
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

export default Settings
