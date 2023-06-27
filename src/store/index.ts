import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import csrfReducer from './csrfSlice'
const actionLogger = (storeAPI) => (next) => (action) => {
    console.trace('dispatching', action)
    return next(action)
}
const store = configureStore({
    reducer: {
        auth: authReducer,
        csrf: csrfReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(actionLogger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
