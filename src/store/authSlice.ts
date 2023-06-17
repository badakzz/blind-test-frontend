import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { User } from '../utils/types'

interface AuthState {
    token: string | null
    isLoggedIn: boolean
    loading: boolean
    error: string | null
    user: User | null // Add this field
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
        { rejectWithValue }
    ) => {
        console.log('login')
        try {
            // todo: add config for dev / prod
            const response = await axios.post(
                `http://localhost:${serverPort}/api/auth/login`,
                credentials,
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            console.log('throw')
            throw rejectWithValue('Invalid email or password')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await axios.post(`http://localhost:${serverPort}/api/auth/logout`, {
                withCredentials: true,
            })
            return null // Return null or any other appropriate value upon successful logout
        } catch (error) {
            return rejectWithValue('Logout failed')
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (
        userData: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `localhost:${serverPort}/api/auth/signup`,
                userData
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
            state.token = action.payload
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
                state.token = action.payload
                state.isLoggedIn = true
                state.user = action.payload.user
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
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
