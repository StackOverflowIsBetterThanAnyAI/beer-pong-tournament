import { useEffect } from 'react'
import {
    useErrorConfirmPasswordProps,
    useErrorPasswordProps,
    useErrorNameProps,
    useErrorSameMemberProps,
} from '../types/types'

export const useErrorConfirmPassword = ({
    confirmPassword,
    password,
    setErrorConfirmPassword,
}: useErrorConfirmPasswordProps) => {
    useEffect(() => {
        if (password === confirmPassword || !confirmPassword) {
            setErrorConfirmPassword('')
        } else {
            setErrorConfirmPassword('The entered passwords do not match!')
        }
    }, [confirmPassword, password, setErrorConfirmPassword])
}

export const useErrorPassword = ({
    password,
    passwordPattern,
    setConfirmPasswordDisabled,
    setErrorPassword,
}: useErrorPasswordProps) => {
    useEffect(() => {
        if (!password) {
            setConfirmPasswordDisabled(true)
            setErrorPassword('')
        } else if (passwordPattern.test(password)) {
            setConfirmPasswordDisabled(false)
            setErrorPassword('')
        } else if (password.length < 8) {
            setConfirmPasswordDisabled(true)
            setErrorPassword('The password must contain at least 8 characters!')
        }
    }, [
        password,
        passwordPattern,
        setConfirmPasswordDisabled,
        setErrorPassword,
    ])
}

export const useErrorName = ({
    setErrorName,
    name,
    namePattern,
    type,
}: useErrorNameProps) => {
    useEffect(() => {
        if (namePattern.test(name) || !name) {
            setErrorName('')
        } else {
            if (name.length < 5) {
                setErrorName(
                    `The ${type} name must contain at least 5 characters!`
                )
            } else if (name.length > 20) {
                setErrorName(
                    `The ${type} name must contain at most 20 characters!`
                )
            } else {
                setErrorName('You must only use Latin letters and numbers!')
            }
        }
    }, [name, namePattern, setErrorName, type])
}

export const useErrorSameMember = ({
    memberOne,
    memberTwo,
    setErrorSameMember,
}: useErrorSameMemberProps) => {
    useEffect(() => {
        if (memberOne && memberTwo && memberOne === memberTwo) {
            setErrorSameMember('Please choose two different player names.')
        } else {
            setErrorSameMember('')
        }
    }, [memberOne, memberTwo, setErrorSameMember])
}
