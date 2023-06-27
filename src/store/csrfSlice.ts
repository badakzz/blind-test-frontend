import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface CSRFState {
    csrfToken: string | null
    loading: boolean
    error: string | null
    fetchInProgress: boolean
}

const initialState: CSRFState = {
    csrfToken: null,
    loading: false,
    error: null,
    fetchInProgress: false,
}

export const getCSRFToken = createAsyncThunk(
    'csrf/getCSRFToken',
    async (_, thunkAPI) => {
        console.log('getCSRFToken action called') // New log
        //@ts-ignore
        const { csrfToken } = thunkAPI.getState().csrf
        if (csrfToken) {
            // CSRF token already exists, no need to fetch it again
            return csrfToken
        }
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`,
                { withCredentials: true }
            )
            const token = response.data.csrfToken
            thunkAPI.dispatch(csrfActions.storeCSRFToken(token))
            return token
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to retrieve CSRF token')
        }
    }
)

const csrfSlice = createSlice({
    name: 'csrf',
    initialState,
    reducers: {
        startFetchCSRFToken(state) {
            state.fetchInProgress = true
        },
        storeCSRFToken(state, action) {
            state.csrfToken = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCSRFToken.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(getCSRFToken.fulfilled, (state, action) => {
                state.csrfToken = action.payload
                state.loading = false
                state.error = null
                state.fetchInProgress = false
            })
            .addCase(getCSRFToken.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
                state.fetchInProgress = false
            })
    },
})

export const { actions: csrfActions } = csrfSlice

export default csrfSlice.reducer
