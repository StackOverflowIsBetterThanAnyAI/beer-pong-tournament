import { useEffect } from 'react'
import {
    useSubmitDisabledLoginProps,
    useSubmitDisabledRegisterProps,
} from '../types/types'

export const useSubmitDisabledLogin = ({
    confirmPassword,
    isSigningUp,
    password,
    passwordPattern,
    setIsSubmitDisabled,
    userName,
    userNamePattern,
}: useSubmitDisabledLoginProps) => {
    useEffect(() => {
        if (
            (isSigningUp &&
                userNamePattern.test(userName) &&
                passwordPattern.test(password) &&
                confirmPassword === password) ||
            (!isSigningUp &&
                userNamePattern.test(userName) &&
                passwordPattern.test(password))
        ) {
            setIsSubmitDisabled(false)
        } else {
            setIsSubmitDisabled(true)
        }
    }, [
        confirmPassword,
        isSigningUp,
        password,
        passwordPattern,
        setIsSubmitDisabled,
        userName,
        userNamePattern,
    ])
}

export const useSubmitDisabledRegister = ({
    memberOne,
    memberTwo,
    setIsSubmitDisabled,
    teamName,
    teamPattern,
}: useSubmitDisabledRegisterProps) => {
    useEffect(() => {
        if (
            teamPattern.test(memberOne) &&
            teamPattern.test(memberTwo) &&
            teamPattern.test(teamName) &&
            memberOne !== memberTwo
        ) {
            setIsSubmitDisabled(false)
        } else {
            setIsSubmitDisabled(true)
        }
    }, [memberOne, memberTwo, setIsSubmitDisabled, teamName, teamPattern])
}
