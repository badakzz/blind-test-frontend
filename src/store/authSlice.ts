import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '../utils/types'
import Cookies from 'js-cookie'
import api from '../api'

export interface AuthState {
    token: string | null
    isLoggedIn: boolean
    loading: boolean
    error: string | null
    user: User | null
    csrfToken: string
}

const initialState: AuthState = {
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
    csrfToken: null,
}

const serverPort = process.env.REACT_APP_SERVER_PORT

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (
        credentials: { email: string; password: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${serverPort}/api/auth/login`,
                credentials,
                { withCredentials: true }
            )
            if (response.status < 200 || response.status >= 300) {
                throw new Error('Invalid credentials')
            }
            const { token, user } = response.data
            console.log({ token, user })
            const formattedUser: User = {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                permissions: user.permissions,
                isActive: user.is_active,
            }
            Cookies.set(process.env.REACT_APP_JWT_COOKIE_NAME, token, {
                expires: 7,
                // httpOnly: true, for production only
                secure: true,
                sameSite: 'strict',
            }) // Add expiration for security
            Cookies.set(
                process.env.REACT_APP_AUTH_COOKIE_NAME,
                JSON.stringify(formattedUser),
                {
                    expires: 7,
                    secure: true,
                    sameSite: 'strict',
                }
            )
            dispatch(authActions.storeToken({ token }))
            dispatch(authActions.setUser(formattedUser))
            if (response.status === 200) {
                const csrfResponse = await api.get(
                    `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`,
                    { withCredentials: true }
                )
                return {
                    token,
                    user: formattedUser,
                    csrfToken: csrfResponse.data.csrfToken,
                }
            }
            return response.data
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message

            throw rejectWithValue(errorMessage)
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
        userData: { username: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${serverPort}/api/auth/signup`,
                userData,
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            return rejectWithValue('Signup failed')
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        storeToken(state, action) {
            console.log('state.token', state.token)
            state.token = action.payload.token
        },
        setUser(state, action) {
            console.log('setuser', state, action)
            state.user = action.payload
        },
        setLoggedIn(state, action) {
            state.isLoggedIn = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload.token
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
                state.token = null
                state.isLoggedIn = false
                state.user = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { actions: authActions } = authSlice

export default authSlice.reducer
function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
