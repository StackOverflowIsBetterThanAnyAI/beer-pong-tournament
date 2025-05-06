import { StandingsProps } from '../../types/types'

type StandingsLegendProps = {
    standings: StandingsProps
}

const StandingsLegend = ({ standings }: StandingsLegendProps) => {
    const thirdAdvance = (() => {
        switch (standings.length) {
            case 2:
            case 4:
            case 8:
                return 0
            case 3:
            case 7:
                return 2
            case 6:
                return 4
            default:
                return 0
        }
    })()

    const thirdEliminated = standings.length - thirdAdvance

    return (
        <div className="flex flex-col w-full max-w-96 bg-stone-200 drop-shadow-stone-600/60 drop-shadow-sm p-2 rounded-sm m-auto mt-2">
            <span className="flex justify-between z-10">
                <h3 className="text-normal mb-1">Legend:</h3>
                <span className="legendinfo relative bg-stone-200 text-center text-normal h-5 w-5 text-red-600 outline-2 outline-red-600 rounded-full">
                    !
                </span>
            </span>
            <ul className="text-small list-disc">
                <li className="ml-4 my-0.5">
                    The first two teams of each group advance.
                </li>
                {thirdAdvance ? (
                    <>
                        <li className="ml-4 my-0.5">
                            Out of all groups, the {thirdAdvance} best
                            third-placed teams advance.
                        </li>
                        <li className="ml-4 my-0.5">
                            The other{' '}
                            {thirdEliminated === 1 ? '' : thirdEliminated}{' '}
                            third-placed team
                            {thirdEliminated === 1 ? '' : 's'}{' '}
                            {thirdEliminated === 1 ? 'is' : 'are'} eliminated.
                        </li>
                        <li className="ml-4 my-0.5">
                            All last-placed teams are eliminated.
                        </li>
                    </>
                ) : (
                    <li className="ml-4 my-0.5">
                        The last two teams of each group are eliminated.
                    </li>
                )}
            </ul>
        </div>
    )
}

export default StandingsLegend
