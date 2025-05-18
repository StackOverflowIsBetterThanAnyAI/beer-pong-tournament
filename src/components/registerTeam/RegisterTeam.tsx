import { useContext, useMemo, useRef, useState } from 'react'
import FormError from './../form/FormError'
import FormErrorOpacity from '../form/FormErrorOpacity'
import FormHeader from './../form/FormHeader'
import FormInput from './../form/FormInput'
import FormSubmit from './../form/FormSubmit'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextKOStage } from '../../context/ContextKOStage'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { ContextSchedule } from '../../context/ContextSchedule'
import { getStoredData } from '../../utils/getStoredData'
import { getStoredSessionData } from '../../utils/getStoredSessionData'
import { handleRegisterTeam } from '../../api/handleRegisterTeam'
import { setItemInSessionStorage } from '../../utils/setItemInSessionStorage'
import { useAutoFocus } from '../../hooks/useAutoFocus'
import { useContextToast } from '../../context/ContextToast'
import { useErrorName, useErrorSameMember } from '../../hooks/useError'
import { useSubmitDisabledRegister } from '../../hooks/useSubmitDisabled'
import { useWindowScrollYState } from '../../hooks/useWindowScrollyState'

const RegisterTeam = () => {
    const parsedStorageData = getStoredData()
    const parsedSessionData = getStoredSessionData()
    const { showToast } = useContextToast()

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error(
            'RegisterTeam must be used within a ContextGroups.Provider'
        )
    }
    const [_groups, setGroups] = contextGroups

    const contextKOStage = useContext(ContextKOStage)
    if (!contextKOStage) {
        throw new Error(
            'RegisterTeam must be used within a ContextKOStage.Provider'
        )
    }
    const [_koStage, setKOStage] = contextKOStage

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'RegisterTeam must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, setRegisteredTeams] = contextRegisteredTeams

    const contextSchedule = useContext(ContextSchedule)
    if (!contextSchedule) {
        throw new Error(
            'RegisterTeam must be used within a ContextSchedule.Provider'
        )
    }
    const [_schedule, setSchedule] = contextSchedule

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )
    const [teamName, setTeamName] = useState<string>(
        parsedSessionData?.teamname || ''
    )
    const [memberOne, setMemberOne] = useState<string>(
        parsedSessionData?.memberone || parsedStorageData?.username || ''
    )
    const [memberTwo, setMemberTwo] = useState<string>(
        parsedSessionData?.membertwo || ''
    )
    const teamNameRef = useRef<HTMLInputElement>(null)

    const [apiError, setApiError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

    const [errorTeamName, setErrorTeamName] = useState<string>('')
    const [errorMemberOne, setErrorMemberOne] = useState<string>('')
    const [errorMemberTwo, setErrorMemberTwo] = useState<string>('')
    const [errorSameMember, setErrorSameMember] = useState<string>('')

    const teamPattern = useMemo<RegExp>(() => /^[a-z0-9]{5,20}$/i, [])

    useAutoFocus(teamNameRef)

    useSubmitDisabledRegister({
        memberOne,
        memberTwo,
        setIsSubmitDisabled,
        teamName,
        teamPattern,
    })

    useErrorName({
        setErrorName: setErrorTeamName,
        name: teamName,
        namePattern: teamPattern,
        type: 'team',
    })

    useErrorName({
        setErrorName: setErrorMemberOne,
        name: memberOne,
        namePattern: teamPattern,
        type: 'player',
    })

    useErrorName({
        setErrorName: setErrorMemberTwo,
        name: memberTwo,
        namePattern: teamPattern,
        type: 'player',
    })

    useErrorSameMember({ memberOne, memberTwo, setErrorSameMember })

    useWindowScrollYState()

    const handleTeamNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setTeamName(e.target.value)
        setItemInSessionStorage('teamname', e.target.value)
        setIsSubmitDisabled(false)
    }

    const handleMemberOneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setMemberOne(e.target.value)
        setItemInSessionStorage('memberone', e.target.value)
        setIsSubmitDisabled(false)
    }

    const handleMemberTwoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setMemberTwo(e.target.value)
        setItemInSessionStorage('membertwo', e.target.value)
        setIsSubmitDisabled(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSubmitDisabled) {
            handleClickRegisterTeam(e)
        }
    }

    const handleClickRegisterTeam = async (
        e:
            | React.MouseEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault()
        setApiError('')
        setIsLoading(true)
        setIsSubmitDisabled(true)

        const registerTeamData = {
            name: teamName,
            member_one: memberOne,
            member_two: memberTwo,
        }

        handleRegisterTeam({
            accessToken,
            refreshToken,
            registerTeamData,
            registeredTeams,
            setApiError,
            setGroups,
            setIsLoading,
            setIsSubmitDisabled,
            setKOStage,
            setRegisteredTeams,
            setSchedule,
            showToast,
        })
    }

    return (
        <main className="flex justify-center w-full max-w-7xl relative isolate bg-stone-300 text-stone-950 lg:rounded-lg p-3 mx-auto drop-shadow-stone-900 drop-shadow-sm">
            <div className="w-96">
                <FormHeader header="Register Team" subHeader="required" />
                <form
                    className="flex flex-col pt-1 lg:pt-3"
                    autoComplete="on"
                    aria-label="Register Team"
                    name="registerteam"
                    method="post"
                    target="_self"
                >
                    <FormInput
                        autoComplete="on"
                        error={errorTeamName}
                        id="registerTeamName"
                        label="Team Name"
                        maxLength={20}
                        minLength={5}
                        onInput={handleTeamNameInput}
                        onKeyDown={handleKeyDown}
                        placeholder="TeamJohnDoe1337"
                        ref={teamNameRef}
                        title="Enter your team name."
                        type="text"
                        value={teamName}
                    />
                    <FormError error={errorTeamName} />
                    <FormInput
                        autoComplete="on"
                        error={errorMemberOne}
                        id="registerMemberOne"
                        label="First Team Member"
                        maxLength={20}
                        minLength={5}
                        onInput={handleMemberOneInput}
                        onKeyDown={handleKeyDown}
                        placeholder="JohnDoe1337"
                        title="Enter the first team member."
                        type="text"
                        value={memberOne}
                    />
                    <FormError error={errorMemberOne} />
                    <FormInput
                        autoComplete="on"
                        error={errorSameMember || apiError || errorMemberTwo}
                        id="registerMemberTwo"
                        label="Second Team Member"
                        maxLength={20}
                        minLength={5}
                        onInput={handleMemberTwoInput}
                        onKeyDown={handleKeyDown}
                        placeholder="JaneDoe420"
                        title="Enter the second team member."
                        type="text"
                        value={memberTwo}
                    />
                    {errorSameMember ? (
                        <FormError error="Please choose two different player names." />
                    ) : apiError ? (
                        <FormErrorOpacity
                            error={
                                apiError ||
                                'Currently, you are unable to register your team.'
                            }
                        />
                    ) : (
                        <FormError error={errorMemberTwo} />
                    )}
                    <FormSubmit
                        handleClick={handleClickRegisterTeam}
                        isDisabled={isSubmitDisabled}
                        isLoading={isLoading}
                        value="Register Team"
                    />
                </form>
            </div>
        </main>
    )
}

export default RegisterTeam
