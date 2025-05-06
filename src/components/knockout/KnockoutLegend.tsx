const KnockoutLegend = () => {
    return (
        <div className="flex flex-col w-full max-w-96 bg-stone-200 drop-shadow-stone-600/60 drop-shadow-sm p-2 rounded-sm m-auto mt-2">
            <span className="flex justify-between z-10">
                <h3 className="text-normal mb-1">Rules for Knockout Stage:</h3>
                <span className="legendinfo relative bg-stone-200 text-center text-normal h-5 w-5 text-red-600 outline-2 outline-red-600 rounded-full">
                    !
                </span>
            </span>
            <ul className="text-small list-disc">
                <li className="ml-4 my-0.5">
                    A match is over, if one teams scores{' '}
                    <strong>10 cups</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    If both teams score 10 cups, the match goes into{' '}
                    <strong>overtime</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    In overtime, each team plays with <strong>3 cups</strong>.
                </li>
                <li className="ml-4 my-0.5">
                    A team wins, if they score all 3 cups.
                </li>
                <li className="ml-4 my-0.5">
                    If both teams score all cups, another round is played.
                </li>
            </ul>
        </div>
    )
}

export default KnockoutLegend
