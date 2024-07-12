import { ToastContext } from '../utils/hooks'
import { ToastMessage } from '../utils/types'
import React, { ReactNode, useState, useCallback, CSSProperties } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [show, setShow] = useState(false)
    const [toastProps, setToastProps] = useState<ToastMessage>({
        message: '',
        delay: 5000,
    })

    const showToast = useCallback((message: ToastMessage) => {
        setToastProps(message)
        setShow(true)
        setTimeout(() => setShow(false), message.delay || 5000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer
                position="bottom-center"
                className="d-flex text-center"
            >
                <Toast
                    bg="danger"
                    onClose={() => setShow(false)}
                    show={show}
                    delay={toastProps.delay || 3000}
                    autohide
                    style={styles.textColor}
                >
                    {toastProps.header && (
                        <Toast.Header>{toastProps.header}</Toast.Header>
                    )}
                    <Toast.Body>{toastProps.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </ToastContext.Provider>
    )
}

const styles: { [key: string]: CSSProperties } = {
    textColor: {
        color: 'white',
        fontWeight: 'bold',
    },
}

export default ToastProvider
