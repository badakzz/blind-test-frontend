import React, { CSSProperties, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AuthState, updateSettings } from '../store/authSlice'
import { RootState } from '../store'
import { isEmailValid, isPasswordValid } from '../utils/helpers'
import { Button, Container, Form } from 'react-bootstrap'
import { useToast } from '../utils/hooks'

const Settings: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const dispatch = useDispatch()
    const authUser = useSelector((state: RootState) => state.auth) as AuthState
    const user = authUser.user
    const updateSuccess = useSelector(
        (state: RootState) => state.auth.updateSuccess
    )
    const { showToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isEmailValid(email) && isPasswordValid(password)) {
            try {
                const action = await dispatch(
                    updateSettings({
                        userId: user.userId,
                        email: email,
                        password: password,
                    }) as any
                )
                if (updateSettings.rejected.match(action)) {
                    throw new Error(action.payload as string)
                } else {
                    await dispatch(
                        updateSettings({
                            userId: user.userId,
                            email: email,
                            password: password,
                        }) as any
                    )
                }
            } catch (error) {
                showToast({
                    message: `Error occurred during signup: ${error.message}`,
                })
            }
        } else {
            handleEmailBlur()
            handlePasswordBlur()
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
                    <Form.Label htmlFor="email">New email:</Form.Label>
                    <Form.Control
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input mb-3"
                        onBlur={handleEmailBlur}
                    />
                </Form.Group>
                {emailError && <div className="text-red">{emailError}</div>}
                <Form.Group>
                    <Form.Label htmlFor="password">New password:</Form.Label>
                    <Form.Control
                        id="password"
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
            {updateSuccess && (
                <div className="text-green">Settings successfully updated</div>
            )}
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '25rem',
    },
}

export default Settings
