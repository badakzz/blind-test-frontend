import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../utils/types'
import Cookies from 'js-cookie'
import api from '../api'
import { RootState } from '.'

export interface AuthState {
    token: string | null
    isLoggedIn: boolean
    loading: boolean
    error: string | null
    user: User | null
    csrfToken: string
    updateSuccess: boolean
}

const initialState: AuthState = {
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
    csrfToken: null,
    updateSuccess: false,
}

export const createGuestUser = createAsyncThunk(
    'auth/createGuestUser',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as RootState
            const csrfToken = state.csrf.csrfToken

            if (!csrfToken) {
                throw new Error('CSRF token not found')
            }

            if (!csrfToken) {
                console.error('csrf')
                throw new Error('CSRF token not found')
            }

            const response = await api.post(
                '/api/v1/users',
                { is_guest: true },
                {
                    withCredentials: true,
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                }
            )

            if (response.status < 200 || response.status >= 300) {
                throw new Error('Failed to create guest user')
            }

            const { user } = response.data
            const formattedUser: User = {
                userId: user.user_id,
                username: user.username,
                permissions: user.permissions,
            }
            Cookies.set(
                process.env.REACT_APP_AUTH_COOKIE_NAME,
                JSON.stringify(formattedUser),
                {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                }
            )
            dispatch(authActions.setUser(formattedUser))

            return {
                user: formattedUser,
                csrfToken: csrfToken,
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message
            return rejectWithValue(errorMessage)
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (
        credentials: { email: string; password: string; captchaValue: string },
        { getState, dispatch, rejectWithValue }
    ) => {
        try {
            const state = getState() as RootState
            const csrfToken = state.csrf.csrfToken

            if (!csrfToken) {
                throw new Error('CSRF token not found')
            }

            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/auth/login`,
                credentials,
                {
                    withCredentials: true,
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                }
            )

            if (response.status < 200 || response.status >= 300) {
                throw new Error('Invalid credentials')
            }

            const { user } = response.data
            const formattedUser: User = {
                userId: user.user_id,
                username: user.username,
                permissions: user.permissions,
            }
            Cookies.set(
                process.env.REACT_APP_AUTH_COOKIE_NAME,
                JSON.stringify(formattedUser),
                {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                }
            )
            dispatch(authActions.setUser(formattedUser))
            return {
                user: formattedUser,
                csrfToken: csrfToken,
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message
            console.error(errorMessage)
            return rejectWithValue(errorMessage)
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            Cookies.remove(process.env.REACT_APP_JWT_COOKIE_NAME)
            Cookies.remove(process.env.REACT_APP_AUTH_COOKIE_NAME)
            return null
        } catch (error) {
            return rejectWithValue('Logout failed')
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (
        userData: {
            username: string
            email: string
            password: string
            captchaValue: string
        },
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as RootState
            const csrfToken = state.csrf.csrfToken

            if (!csrfToken) {
                throw new Error('CSRF token not found')
            }

            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/auth/signup`,
                {
                    ...userData,
                    captchaValue: userData.captchaValue,
                },
                {
                    withCredentials: true,
                    headers: { 'X-CSRF-TOKEN': csrfToken },
                }
            )

            if (response.status < 200 || response.status >= 300) {
                throw new Error('Signup failed due to server error')
            }

            return response.data.user
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message
            console.error(errorMessage)
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateSettings = createAsyncThunk(
    'auth/updateSettings',
    async (
        settings: { userId: number; email?: string; password?: string },
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as RootState
            const csrfToken = state.csrf.csrfToken

            if (!csrfToken) {
                throw new Error('CSRF token or JWT token not found')
            }

            const headers = {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            }

            const response = await api.post('/api/auth/settings', settings, {
                headers,
                withCredentials: true,
            })
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message
            console.error(errorMessage)
            return rejectWithValue(errorMessage)
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        storeToken(state, action) {
            state.token = action.payload.token
        },
        setUser(state, action) {
            state.user = action.payload
        },
        setLoggedIn(state, action) {
            state.isLoggedIn = action.payload
        },
        setPermissions(state, action) {
            state.user.permissions = action.payload.permissions

            const rawCookieValue = Cookies.get(
                process.env.REACT_APP_AUTH_COOKIE_NAME
            )
            const parsedCookieValue = rawCookieValue
                ? JSON.parse(rawCookieValue)
                : null
            if (parsedCookieValue) {
                parsedCookieValue.permissions = 2
            }
            const stringifiedCookieValue = JSON.stringify(parsedCookieValue)
            Cookies.set(
                process.env.REACT_APP_AUTH_COOKIE_NAME,
                stringifiedCookieValue,
                {
                    expires: 7,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                }
            )
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGuestUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createGuestUser.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = false
                state.user = action.payload.user
                state.csrfToken = action.payload.csrfToken
            })
            .addCase(createGuestUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = true
                state.user = action.payload.user
                state.csrfToken = action.payload.csrfToken
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = false
                state.user = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(signupUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false
                state.isLoggedIn = true
                state.user = action.payload
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.loading = false
                state.updateSuccess = true
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.updateSuccess = false
            })
    },
})

export const { actions: authActions } = authSlice

export default authSlice.reducer
