import { useContext, useMemo, useRef, useState } from 'react'
import FormError from './../form/FormError'
import FormHeader from './../form/FormHeader'
import FormInput from './../form/FormInput'
import FormSubmit from './../form/FormSubmit'
import { SERVER_ADDRESS } from '../../constants/constants'
import { ContextGroups } from '../../context/ContextGroups'
import { ContextRegisteredTeams } from '../../context/ContextRegisteredTeams'
import { getStoredData } from '../../utils/getStoredData'
import { getValidToken } from '../../utils/getValidToken'
import { getValueFromError } from '../../utils/getValueFromError'
import { setItemInStorage } from '../../utils/setItemInStorage'
import { useAutoFocus } from '../../hooks/useAutoFocus'
import { useErrorName, useErrorSameMember } from '../../hooks/useError'
import { useSubmitDisabledRegister } from '../../hooks/useSubmitDisabled'

const RegisterTeam = () => {
    const parsedStorageData = getStoredData()

    const contextGroups = useContext(ContextGroups)
    if (!contextGroups) {
        throw new Error(
            'RegisterTeam must be used within a ContextGroups.Provider'
        )
    }
    const [_groups, setGroups] = contextGroups

    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'RegisterTeam must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, setRegisteredTeams] = contextRegisteredTeams

    const [accessToken, _setAccessToken] = useState<string>(
        parsedStorageData?.access || ''
    )
    const [refreshToken, _setRefreshToken] = useState<string>(
        parsedStorageData?.refresh || ''
    )
    const [teamName, setTeamName] = useState<string>(
        parsedStorageData?.teamname || ''
    )
    const [memberOne, setMemberOne] = useState<string>(
        parsedStorageData?.memberone || parsedStorageData?.username || ''
    )
    const [memberTwo, setMemberTwo] = useState<string>(
        parsedStorageData?.membertwo || ''
    )
    const teamNameRef = useRef<HTMLInputElement>(null)

    const [apiError, setApiError] = useState<string>('')
    const [sendingRequest, setSendingRequest] = useState<boolean>(false)
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)

    const [errorTeamName, setErrorTeamName] = useState<string>('')
    const [errorMemberOne, setErrorMemberOne] = useState<string>('')
    const [errorMemberTwo, setErrorMemberTwo] = useState<string>('')
    const [errorSameMember, setErrorSameMember] = useState<string>('')

    const teamPattern = useMemo<RegExp>(() => /^[a-z0-9]{5,20}$/i, [])

    useAutoFocus(teamNameRef)

    useSubmitDisabledRegister({
        memberOne,
        memberTwo,
        setSubmitDisabled,
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

    const handleTeamNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setTeamName(e.target.value)
        setItemInStorage('teamname', e.target.value)
    }

    const handleMemberOneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setMemberOne(e.target.value)
        setItemInStorage('memberone', e.target.value)
    }

    const handleMemberTwoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiError('')
        setMemberTwo(e.target.value)
        setItemInStorage('membertwo', e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !submitDisabled) {
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
        setSendingRequest(true)
        setSubmitDisabled(true)

        const registerTeamData = {
            name: teamName,
            member_one: memberOne,
            member_two: memberTwo,
        }

        try {
            const response = await fetch(`${SERVER_ADDRESS}/api/v1/teams/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getValidToken(
                        accessToken,
                        refreshToken
                    )}`,
                },
                body: JSON.stringify(registerTeamData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                setApiError(getValueFromError(errorData))
                return
            }

            const result = await response.json()
            const updatedTeams = [
                ...registeredTeams,
                {
                    id: result.id,
                    name: teamName,
                    member_one: memberOne,
                    member_two: memberTwo,
                },
            ]
            setRegisteredTeams(updatedTeams)
            setItemInStorage('registeredteams', updatedTeams)
            try {
                const response = await fetch(
                    `${SERVER_ADDRESS}/api/v1/groups/delete/`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${await getValidToken(
                                accessToken,
                                refreshToken
                            )}`,
                        },
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    setApiError(getValueFromError(errorData))
                    return
                }

                setItemInStorage('groups', [])
                setGroups([])
            } catch (error: any) {
                setApiError(
                    'An unexpected error occurred while deleting the current groups.'
                )
            }
        } catch (error: any) {
            setApiError('An unexpected error occurred while adding your team.')
        } finally {
            setSendingRequest(false)
            setSubmitDisabled(false)
        }
    }

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6 drop-shadow-stone-900 drop-shadow-sm">
            <FormHeader header="Register Team" subHeader="required" />
            <form
                className="flex flex-col"
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
                    <FormError
                        error={
                            apiError ||
                            'Currently, you are unable to register your team.'
                        }
                    />
                ) : (
                    <FormError error={errorMemberTwo} />
                )}
                <FormSubmit
                    disabled={submitDisabled}
                    handleClick={handleClickRegisterTeam}
                    sendingRequest={sendingRequest}
                    value="Register Team"
                />
            </form>
        </main>
    )
}

export default RegisterTeam
