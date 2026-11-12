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
    setErrorPassword,
}: useErrorPasswordProps) => {
    useEffect(() => {
        if (!password || passwordPattern.test(password)) {
            setErrorPassword('')
        } else if (/\s/.test(password)) {
            setErrorPassword('The password must not contain any spaces!')
        } else if (password.length < 8) {
            setErrorPassword('The password must contain at least 8 characters!')
        } else {
            setErrorPassword('The password must contain at most 25 characters!')
        }
    }, [password, passwordPattern, setErrorPassword])
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
