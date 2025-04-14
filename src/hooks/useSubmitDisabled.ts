import { useEffect } from 'react'

type useSubmitDisabledLoginProps = {
    confirmPassword: string
    isSigningUp: boolean
    password: string
    passwordPattern: RegExp
    setSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    userName: string
    userNamePattern: RegExp
}

type useSubmitDisabledRegisterProps = {
    memberOne: string
    memberTwo: string
    setSubmitDisabled: React.Dispatch<React.SetStateAction<boolean>>
    teamName: string
    teamPattern: RegExp
}

export const useSubmitDisabledLogin = ({
    confirmPassword,
    isSigningUp,
    password,
    passwordPattern,
    setSubmitDisabled,
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
            setSubmitDisabled(false)
        } else {
            setSubmitDisabled(true)
        }
    }, [
        confirmPassword,
        isSigningUp,
        password,
        passwordPattern,
        setSubmitDisabled,
        userName,
        userNamePattern,
    ])
}

export const useSubmitDisabledRegister = ({
    memberOne,
    memberTwo,
    setSubmitDisabled,
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
            setSubmitDisabled(false)
        } else {
            setSubmitDisabled(true)
        }
    }, [memberOne, memberTwo, setSubmitDisabled, teamName, teamPattern])
}
