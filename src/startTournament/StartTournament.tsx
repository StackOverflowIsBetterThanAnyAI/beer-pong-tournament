import { useContext } from 'react'
import { ContextRegisteredTeams } from '../context/ContextRegisteredTeams'
import FormHeader from '../components/form/FormHeader'

export const StartTournament = () => {
    const contextRegisteredTeams = useContext(ContextRegisteredTeams)
    if (!contextRegisteredTeams) {
        throw new Error(
            'RegisterTeam must be used within a ContextRegisteredTeams.Provider'
        )
    }
    const [registeredTeams, setRegisteredTeams] = contextRegisteredTeams

    return (
        <main className="w-full bg-stone-300 text-stone-950 sm:w-80 md:w-112 sm:rounded-lg p-3 sm:p-4 md:p-6">
            <FormHeader header="Start Tournament" />
            <div className="text-center text-large">
                {registeredTeams.length} / 32 Teams
            </div>
        </main>
    )
}

export default StartTournament
