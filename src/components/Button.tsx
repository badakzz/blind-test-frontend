import React, { ForwardRefExoticComponent, FunctionComponent } from 'react'
import { Button as RBButton, ButtonProps, Spinner } from 'react-bootstrap'

export type Props = {
    isLoading?: boolean
    LeftIcon?: FunctionComponent<{ size: number } & any>
    RightIcon?: FunctionComponent<{ size: number } & any>
} & ButtonProps

const Button: ForwardRefExoticComponent<Props> = React.forwardRef(
    ({ isLoading, LeftIcon, RightIcon, children, ...restOfProps }, ref) => (
        <RBButton
            {...restOfProps}
            className={`${
                restOfProps?.className || ''
            } d-flex align-items-center justify-content-center`}
        >
            {isLoading && <Spinner animation="border" size="sm" />}
            {!!LeftIcon && !isLoading && (
                <LeftIcon size={12} className="me-2" />
            )}
            {!isLoading && children}
            {!!RightIcon && !isLoading && (
                <RightIcon size={12} className="ms-2" />
            )}
        </RBButton>
    )
)

Button.displayName = 'Button'

export default Button
