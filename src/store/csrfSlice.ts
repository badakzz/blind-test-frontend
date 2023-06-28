import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface CSRFState {
    loading: boolean
    error: string | null
    fetchInProgress: boolean
}

const initialState: CSRFState = {
    loading: false,
    error: null,
    fetchInProgress: false,
}

export const getCSRFToken = createAsyncThunk(
    'csrf/getCSRFToken',
    async (_, thunkAPI) => {
        try {
            await axios.get(
                `${process.env.REACT_APP_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`,
                { withCredentials: true }
            )
            return
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to retrieve CSRF token')
        }
    }
)

const csrfSlice = createSlice({
    name: 'csrf',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCSRFToken.pending, (state) => {
                state.fetchInProgress = true
            })
            .addCase(getCSRFToken.fulfilled, (state) => {
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
