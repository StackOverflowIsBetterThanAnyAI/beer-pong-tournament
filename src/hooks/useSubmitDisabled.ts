import { useEffect } from 'react'

type useSubmitDisabledLoginProps = {
    confirmPassword: string
    isSigningUp: boolean
    password: string
    passwordPattern: RegExp
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    userName: string
    userNamePattern: RegExp
}

type useSubmitDisabledRegisterProps = {
    memberOne: string
    memberTwo: string
    setIsSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    teamName: string
    teamPattern: RegExp
}

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
