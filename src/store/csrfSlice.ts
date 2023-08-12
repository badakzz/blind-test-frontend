import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

interface CSRFState {
    loading: boolean
    error: string | null
    fetchInProgress: boolean
    csrfToken: string
}

const initialState: CSRFState = {
    loading: false,
    error: null,
    fetchInProgress: false,
    csrfToken: null,
}

export const getCSRFToken = createAsyncThunk(
    'csrf/getCSRFToken',
    async (_, thunkAPI) => {
        try {
            const response = await api.get(
                `${process.env.REACT_APP_SERVER_DOMAIN}/api/auth/csrf`,
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
                state.fetchInProgress = true
            })
            .addCase(getCSRFToken.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.fetchInProgress = false
                state.csrfToken = action.payload
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
