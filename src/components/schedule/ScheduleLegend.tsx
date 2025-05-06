const ScheduleLegend = () => {
    return (
        <div className="flex flex-col w-full max-w-96 bg-stone-200 p-2 rounded-sm m-auto mt-2">
            <span className="flex justify-between z-10">
                <h3 className="text-normal mb-1">Rules for Group Stage:</h3>
                <span className="legendinfo relative bg-stone-200 text-center text-normal h-5 w-5 text-red-600 outline-2 outline-red-600 rounded-full">
                    !
                </span>
            </span>
            <ul className="text-small list-disc">
                <li className="ml-4 my-0.5">
                    A Match is over, if one teams scores{' '}
                    <strong>10 Cups</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    If both teams score 10 Cups, the Match is a Draw.
                </li>
                <li className="ml-4 my-0.5">
                    For a Win, you receive <strong>3 Points</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    A Draw results in <strong>1 Point</strong> each for both
                    teams.
                </li>
                <li className="ml-4 my-0.5">The Loser gets no Points.</li>
            </ul>
        </div>
    )
}

export default ScheduleLegend
