import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

interface CSRFState {
    loading: boolean
    error: string | null
    csrfToken: string
}

const initialState: CSRFState = {
    loading: false,
    error: null,
    csrfToken: null,
}

export const getCSRFToken = createAsyncThunk(
    'csrf/getCSRFToken',
    async (_, thunkAPI) => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`,
                { withCredentials: true }
            )
            return response.data.csrfToken
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
                state.loading = true
            })
            .addCase(getCSRFToken.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.csrfToken = action.payload
            })
            .addCase(getCSRFToken.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { actions: csrfActions } = csrfSlice

export default csrfSlice.reducer
