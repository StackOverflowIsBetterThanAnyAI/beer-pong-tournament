const ScheduleLegend = () => {
    return (
        <div className="flex flex-col w-full max-w-96 sm:max-w-lg bg-stone-200 drop-shadow-stone-600/60 drop-shadow-sm p-2 rounded-sm m-auto mt-2">
            <span className="flex justify-between z-10">
                <h3 className="text-normal mb-1">Rules for Group Stage:</h3>
                <span
                    aria-hidden="true"
                    className="legendinfo relative bg-stone-200 text-center text-sm h-5 w-5 text-red-600 outline-2 outline-red-600 rounded-full"
                >
                    !
                </span>
            </span>
            <ul className="text-small list-disc">
                <li className="ml-4 my-0.5">
                    A match is over, if one teams scores{' '}
                    <strong>10 cups</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    If both teams score 10 cups, the match is a draw.
                </li>
                <li className="ml-4 my-0.5">
                    For a win, you receive <strong>3 points</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    A draw results in <strong>1 Point</strong> each for both
                    teams.
                </li>
                <li className="ml-4 my-0.5">The loser gets no points.</li>
            </ul>
        </div>
    )
}

export default ScheduleLegend
