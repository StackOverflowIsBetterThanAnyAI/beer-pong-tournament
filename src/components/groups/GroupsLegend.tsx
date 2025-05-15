const GroupsLegend = () => {
    return (
        <div className="flex flex-col w-full max-w-96 bg-stone-200 drop-shadow-stone-600/60 drop-shadow-sm p-2 rounded-sm m-auto mt-2">
            <span className="flex justify-between z-10">
                <h3 className="text-normal mb-1">Rules:</h3>
                <span className="legendinfo relative bg-stone-200 text-center text-sm h-5 w-5 text-red-600 outline-2 outline-red-600 rounded-full">
                    !
                </span>
            </span>
            <ul className="text-small list-disc">
                <li className="ml-4 my-0.5">A group consists of four teams.</li>
                <li className="ml-4 my-0.5">A team consists of two players.</li>
                <li className="ml-4 my-0.5">
                    A player can only be a member of one team.
                </li>
                <li className="ml-4 my-0.5">
                    In the group phase, all four teams in a group play against
                    each other once.
                </li>
            </ul>
        </div>
    )
}

export default GroupsLegend
