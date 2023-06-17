import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

interface CSRFState {
    token: string | null
    loading: boolean
    error: string | null
}

const initialState: CSRFState = {
    token: null,
    loading: false,
    error: null,
}

export const getCSRFToken = createAsyncThunk(
    'auth/getCSRFToken',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(
                `http://localhost:${process.env.REACT_APP_SERVER_PORT}/api/auth/csrf`,
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
                state.error = null
            })
            .addCase(getCSRFToken.fulfilled, (state, action) => {
                state.loading = false
                state.token = action.payload
            })
            .addCase(getCSRFToken.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { actions: authActions } = csrfSlice

export default csrfSlice.reducer
function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}
