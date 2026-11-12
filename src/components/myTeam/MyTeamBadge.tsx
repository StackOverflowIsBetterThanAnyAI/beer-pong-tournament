import { useMyTeams } from '../../hooks/useMyTeams'

type MyTeamBadgeProps = {
    name?: string | null
}

const MyTeamBadge = ({ name }: MyTeamBadgeProps) => {
    const { isMyTeam } = useMyTeams()

    if (!isMyTeam(name)) return null

    return (
        <span
            className="inline-block align-middle whitespace-nowrap ml-2 px-2 py-0.5 mb-1 rounded-full
            bg-stone-800 text-stone-50 text-very-small font-semibold leading-none"
            title="This is your team"
            data-testid="my-team-badge"
        >
            Your Team
        </span>
    )
}

export default MyTeamBadge
