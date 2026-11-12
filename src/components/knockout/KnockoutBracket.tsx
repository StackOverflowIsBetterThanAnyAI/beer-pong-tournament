import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
    KnockoutBracketProps,
    KnockoutBracketTeamProps,
    KOMatchProps,
} from '../../types/types'
import { useMyTeams } from '../../hooks/useMyTeams'

const ROUND_ORDER: KOMatchProps['round'][] = ['R16', 'QF', 'SF', 'F']

const ROUND_LABELS: Record<KOMatchProps['round'], string> = {
    R16: 'Round of 16',
    QF: 'Quarterfinals',
    SF: 'Semifinals',
    F: 'Final',
}

const BracketTeam = ({
    isMine,
    isWinner,
    name,
    score,
}: KnockoutBracketTeamProps) => (
    <div
        className={`flex justify-between gap-2 py-1 pr-2 ${
            isMine ? 'border-l-4 border-stone-800 pl-1' : 'pl-2'
        } ${isWinner ? 'font-bold' : ''}`}
        title={isMine ? `${name} (your team)` : (name ?? 'To be determined')}
    >
        <span
            className={`text-ellipsis overflow-hidden whitespace-nowrap ${
                name ? '' : 'italic text-stone-600'
            }`}
        >
            {name ?? 'TBD'}
        </span>
        <span>{score ?? '-'}</span>
    </div>
)

const KnockoutBracket = ({ koStage }: KnockoutBracketProps) => {
    const { isMyTeam } = useMyTeams()
    const headingId = useId()

    const scrollRef = useRef<HTMLDivElement>(null)
    const [isScrollable, setIsScrollable] = useState<boolean>(false)

    const rounds = useMemo(() => {
        const firstRound = koStage[0]?.round
        const firstIndex = ROUND_ORDER.indexOf(firstRound)
        if (firstIndex === -1) return []

        const firstCount = koStage.filter((m) => m.round === firstRound).length

        return ROUND_ORDER.slice(firstIndex).map((round, r) => {
            const matches = koStage.filter((m) => m.round === round)
            const count = Math.max(1, Math.round(firstCount / 2 ** r))
            return {
                round,
                label: matches[0]?.round_display || ROUND_LABELS[round],
                matches: Array.from(
                    { length: count },
                    (_, k) => matches[k] ?? null
                ),
            }
        })
    }, [koStage])

    useEffect(() => {
        const element = scrollRef.current
        if (!element) return

        const update = () =>
            setIsScrollable(element.scrollWidth > element.clientWidth)
        update()

        const observer = new ResizeObserver(update)
        observer.observe(element)
        if (element.firstElementChild) {
            observer.observe(element.firstElementChild)
        }
        return () => observer.disconnect()
    }, [rounds])

    const teamLabel = (name: string | null) =>
        `${name}${isMyTeam(name) ? ' (your team)' : ''}`

    const describeMatch = (match: KOMatchProps | null) => {
        if (!match) return 'To be determined'

        const team1 = teamLabel(match.team1_name)
        const team2 = teamLabel(match.team2_name)

        if (!match.played) return `${team1} versus ${team2}, not played yet`

        const s1 = match.score_team1 ?? 0
        const s2 = match.score_team2 ?? 0
        const winner = s1 > s2 ? team1 : team2
        return `${team1} ${s1}, ${team2} ${s2}, ${winner} wins`
    }

    if (!rounds.length) return null

    return (
        <section
            className="w-full max-w-4xl mx-auto mt-4"
            aria-labelledby={headingId}
            data-testid="knockout-bracket"
        >
            <h2
                id={headingId}
                className="text-large font-bold pb-2 lg:pb-2.5 max-w-96 sm:max-w-lg lg:max-w-none mx-auto"
            >
                Bracket
            </h2>
            <div
                ref={scrollRef}
                className="overflow-x-auto pb-2 rounded-md focus-visible:outline-2 focus-visible:outline-red-400"
                {...(isScrollable
                    ? {
                          tabIndex: 0,
                          role: 'region',
                          'aria-labelledby': headingId,
                      }
                    : {})}
                data-testid="knockout-bracket-scroll"
            >
                <div className="flex gap-6 w-fit min-w-max mx-auto p-2 rounded-md bg-stone-400/70">
                    {rounds.map(({ round, label, matches }, r) => {
                        const isLastRound = r === rounds.length - 1
                        const roundHeadingId = `${headingId}-${round}`
                        const pairs = isLastRound
                            ? [matches]
                            : Array.from(
                                  { length: matches.length / 2 },
                                  (_, p) => matches.slice(p * 2, p * 2 + 2)
                              )

                        return (
                            <div
                                key={round}
                                className="flex flex-col w-40 sm:w-48"
                            >
                                <h3
                                    id={roundHeadingId}
                                    className="text-normal font-bold text-center pb-2"
                                >
                                    {label}
                                </h3>
                                <div
                                    role="list"
                                    aria-labelledby={roundHeadingId}
                                    className="flex flex-col flex-1"
                                >
                                    {pairs.map((pair, p) => (
                                        <div
                                            key={p}
                                            className={`relative flex flex-col flex-1 ${
                                                isLastRound
                                                    ? ''
                                                    : "after:content-[''] after:absolute after:top-1/4 after:bottom-1/4 after:-right-3 after:w-3 after:border-y-2 after:border-r-2 after:border-stone-600 after:rounded-r-sm"
                                            }`}
                                        >
                                            {pair.map((match, m) => {
                                                const team1 =
                                                    match?.team1_name ?? null
                                                const team2 =
                                                    match?.team2_name ?? null
                                                const played = !!match?.played
                                                const s1 = match?.score_team1
                                                const s2 = match?.score_team2

                                                return (
                                                    <div
                                                        key={match?.id ?? m}
                                                        role="listitem"
                                                        className={`relative flex flex-1 items-center py-1 ${
                                                            r > 0
                                                                ? "before:content-[''] before:absolute before:top-1/2 before:-left-3 before:w-3 before:border-t-2 before:border-stone-600"
                                                                : ''
                                                        }`}
                                                    >
                                                        <span className="sr-only">
                                                            {describeMatch(
                                                                match
                                                            )}
                                                        </span>
                                                        <div
                                                            aria-hidden="true"
                                                            className="w-full text-small rounded-sm bg-stone-200 drop-shadow-stone-300/80 drop-shadow-md"
                                                        >
                                                            <BracketTeam
                                                                isMine={isMyTeam(
                                                                    team1
                                                                )}
                                                                isWinner={
                                                                    played &&
                                                                    (s1 ?? 0) >
                                                                        (s2 ??
                                                                            0)
                                                                }
                                                                name={team1}
                                                                score={s1}
                                                            />
                                                            <hr className="border-stone-500/50" />
                                                            <BracketTeam
                                                                isMine={isMyTeam(
                                                                    team2
                                                                )}
                                                                isWinner={
                                                                    played &&
                                                                    (s2 ?? 0) >
                                                                        (s1 ??
                                                                            0)
                                                                }
                                                                name={team2}
                                                                score={s2}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default KnockoutBracket
