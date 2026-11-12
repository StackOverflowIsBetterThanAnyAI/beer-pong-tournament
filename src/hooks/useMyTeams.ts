import { useContext, useMemo } from 'react'
import { ContextRegisteredTeams } from '../context/ContextRegisteredTeams'
import { RegisteredTeamProps } from '../types/types'
import { getStoredData } from '../utils/getStoredData'

export const useMyTeams = () => {
    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'useMyTeams must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams] = contextRegisteredTeams

    const userName = getStoredData()?.username.trim() || ''

    return useMemo(() => {
        const myTeams: RegisteredTeamProps[] = userName
            ? registeredTeams.filter(
                  (team) =>
                      team.member_one.trim() === userName ||
                      team.member_two.trim() === userName
              )
            : []
        const myTeamNames = new Set(myTeams.map((team) => team.name))

        return {
            isMyTeam: (teamName?: string | null) =>
                !!teamName && myTeamNames.has(teamName),
            myTeamNames,
            myTeams,
        }
    }, [registeredTeams, userName])
}
