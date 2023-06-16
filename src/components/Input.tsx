import React, { CSSProperties, FunctionComponent } from "react"
import { Form, FormControlProps } from "react-bootstrap"

type Props = {
    label?: string
    name: string
    required?: boolean
    formControlProps: FormControlProps
    canHaveError?: boolean
    error?: string
    size?: "sm"
    hasFormErrors?: () => void
} & any

const Input: FunctionComponent<Props> = ({
    label,
    name,
    required,
    formControlProps,
    canHaveError,
    error,
    size,
    placeholder,
    setHasFormErrors,
    ...restOfProps
}) => {
    return (
        <Form.Group {...restOfProps}>
            {!!label && (
                <Form.Label className="fw-bold">
                    {label}
                    {required && <span style={styles.star}>{` *`}</span>}
                </Form.Label>
            )}
            <Form.Control
                {...formControlProps}
                placeholder={placeholder}
                required={required}
                name={name}
                style={{
                    ...(formControlProps?.style || {}),
                    ...(size === "sm" ? styles.smFormControl : {}),
                }}
            />
            {canHaveError && (
                <div
                    style={
                        size === "sm"
                            ? styles.smErrorContainer
                            : styles.errorContainer
                    }
                    className="d-flex flex-column justify-content-end align-items-end w-100"
                >
                    {!!error && (
                        <div
                            className="text-danger"
                            style={size === "sm" ? styles.smErrorLabel : {}}
                        >
                            {error}
                        </div>
                    )}
                </div>
            )}
        </Form.Group>
    )
}

const styles: { [key: string]: CSSProperties } = {
    star: {
        color: "var(--bs-red)",
    },
    errorContainer: {
        minHeight: 24,
    },
    smErrorContainer: {
        minHeight: 22,
    },
    smFormControl: {
        fontSize: 13,
    },
    smErrorLabel: {
        fontSize: 13,
    },
}

export default Input
