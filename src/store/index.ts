import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import csrfReducer from './csrfSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        csrf: csrfReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
