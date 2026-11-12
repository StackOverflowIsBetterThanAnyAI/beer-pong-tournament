import {
    isLoginFormValidProps,
    isRegisterTeamFormValidProps,
} from '../types/types'

export const isLoginFormValid = ({
    confirmPassword,
    isSigningUp,
    password,
    passwordPattern,
    userName,
    userNamePattern,
}: isLoginFormValidProps): boolean =>
    userNamePattern.test(userName) &&
    passwordPattern.test(password) &&
    (!isSigningUp || confirmPassword === password)

export const isRegisterTeamFormValid = ({
    memberOne,
    memberTwo,
    teamName,
    teamPattern,
}: isRegisterTeamFormValidProps): boolean =>
    teamPattern.test(memberOne) &&
    teamPattern.test(memberTwo) &&
    teamPattern.test(teamName) &&
    memberOne !== memberTwo
