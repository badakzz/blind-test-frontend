import React, {
    createContext,
    FunctionComponent,
    useContext,
    useState,
    PropsWithChildren,
    CSSProperties,
} from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import throttle from 'lodash/throttle'
import HandleErrorService, {
    ErrorHandler,
    ErrorType,
} from '../../utils/ErrorHandlerService'

const ToastContext = createContext<{
    showErrorToast: (error: ErrorType, errorHandler?: ErrorHandler) => void
    showSuccessToast: (message: string) => void
}>({ showErrorToast: () => {}, showSuccessToast: () => {} })

type Props = PropsWithChildren<{
    org?: any
}>

const ToastProvider: FunctionComponent<Props> = ({ org, children }) => {
    const [toastConfig, setToastConfig] = useState<null | {
        message: string
        type: 'error' | 'success'
    }>(null)
    const [isDemoErrorToastVisible, setIsDemoErrorToastVisible] =
        useState(false)

    const hideToast = () => setToastConfig(null)

    const showErrorToast = (error: ErrorType, errorHandler?: ErrorHandler) =>
        setToastConfig({
            message: HandleErrorService.getErrorMessage(error, errorHandler),
            type: 'error',
        })

    const showSuccessToast = (message: string) =>
        setToastConfig({
            message,
            type: 'success',
        })

    const showErrorToastThrottled = throttle(showErrorToast, 2000)

    return (
        <ToastContext.Provider
            value={{
                showErrorToast: showErrorToastThrottled,
                showSuccessToast,
            }}
        >
            {children}
            <ToastContainer
                containerPosition="fixed"
                position="bottom-center"
                className="mb-3"
                style={styles.toastContainer}
            >
                <Toast
                    bg={toastConfig?.type === 'success' ? 'success' : 'danger'}
                    show={!!toastConfig}
                    onClose={hideToast}
                    delay={3000}
                    autohide
                >
                    {!!toastConfig?.message && (
                        <Toast.Body
                            className="text-white"
                            style={styles.toastBody}
                        >
                            {toastConfig.message}
                        </Toast.Body>
                    )}
                </Toast>
            </ToastContainer>
            {/* {isInDemo && (
                <ToastContainer
                    containerPosition="fixed"
                    position="bottom-end"
                    className="mb-3 me-3"
                    style={styles.toastContainer}
                >
                    <Toast
                        bg="success"
                        show={isDemoErrorToastVisible}
                        onClose={() => setIsDemoErrorToastVisible(false)}
                        delay={3000}
                        autohide
                        style={styles.demoErrorToast}
                    />
                </ToastContainer>
            )} */}
        </ToastContext.Provider>
    )
}

const DEMO_ERROR_TOAST_SIZE = 10

const styles: { [key: string]: CSSProperties } = {
    toastContainer: {
        zIndex: 2147483647,
    },
    toastBody: {
        textAlign: 'center',
    },
    demoErrorToast: {
        height: DEMO_ERROR_TOAST_SIZE,
        width: DEMO_ERROR_TOAST_SIZE,
        borderRadius: DEMO_ERROR_TOAST_SIZE / 2,
    },
}

export default ToastProvider

export const useToastContext = () => useContext(ToastContext)
