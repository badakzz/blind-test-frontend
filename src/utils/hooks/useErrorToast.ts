import { createContext, useContext } from 'react'
import { ToastMessage } from '../types'

interface ToastContextType {
    showToast: (message: ToastMessage) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(
    undefined
)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
