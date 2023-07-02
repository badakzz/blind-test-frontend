import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { User } from '../utils/types'
import Cookies from 'js-cookie'

export interface AuthState {
    token: string | null
    isLoggedIn: boolean
    loading: boolean
    error: string | null
    user: User | null
}

const initialState: AuthState = {
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
}

const serverPort = process.env.REACT_APP_SERVER_PORT

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (
        credentials: { email: string; password: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${serverPort}/api/auth/login`,
                credentials,
                { withCredentials: true }
            )
            const { token, user } = response.data
            Cookies.set(process.env.REACT_APP_JWT_COOKIE_NAME, token, {
                expires: 7,
            }) // Add expiration for security
            dispatch(authActions.storeToken({ token }))
            dispatch(authActions.setUser(user))

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user))
            return response.data
        } catch (error) {
            throw rejectWithValue('Invalid email or password')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${serverPort}/api/auth/logout`,
                {
                    withCredentials: true,
                }
            )
            return null // Return null or any other appropriate value upon successful logout
        } catch (error) {
            return rejectWithValue('Logout failed')
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (
        userData: { user_name: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
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
            state.token = action.payload.token
        },
        setUser(state, action) {
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
                state.token = action.payload.user.token // store only the JWT token string
                state.isLoggedIn = true
                state.user = action.payload.user
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
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
