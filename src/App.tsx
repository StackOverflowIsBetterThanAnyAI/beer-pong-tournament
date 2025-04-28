import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/footer/Footer'
import FourOhFour from './404/FourOhFour'
import GroupsGenerator from './components/groups/GroupsGenerator'
import Login from './components/login/Login'
import Navigation from './components/navigation/Navigation'
import RegisterTeam from './components/registerTeam/RegisterTeam'
import Schedule from './components/schedule/Schedule'
import Standings from './components/standings/Standings'
import Teams from './components/teams/Teams'
import { ContextAdmin } from './context/ContextAdmin'
import { ContextGroups } from './context/ContextGroups'
import { ContextIsLoggedIn, ContextLoggedInUser } from './context/ContextLogin'
import { ContextRegisteredTeams } from './context/ContextRegisteredTeams'
import { ContextSchedule } from './context/ContextSchedule'
import { ContextStandings } from './context/ContextStandings'
import {
    LoggedInUserProps,
    RegisteredTeamsProps,
    ScheduleProps,
    StandingsProps,
    TournamentGroupsProps,
} from './types/types'
import { getStoredData } from './utils/getStoredData'
import { useDocumentTitle } from './hooks/useDocumentTitle'
import { useFocusTrap } from './hooks/useFocusTrap'

const App = () => {
    const parsedStorageData = getStoredData()

    const [groups, setGroups] = useState<TournamentGroupsProps>(
        parsedStorageData?.groups || []
    )
    const [isAdmin, setIsAdmin] = useState<boolean>(
        parsedStorageData?.isadmin ?? false
    )
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(
        parsedStorageData?.isloggedin ?? false
    )
    const [loggedInUser, setLoggedInUser] = useState<
        LoggedInUserProps | undefined
    >({
        user: parsedStorageData?.username || '',
        token: parsedStorageData?.token || '',
    })
    const [registeredTeams, setRegisteredTeams] =
        useState<RegisteredTeamsProps>(parsedStorageData?.registeredteams || [])
    const [schedule, setSchedule] = useState<ScheduleProps>(
        parsedStorageData?.schedule || []
    )
    const [standings, setStandings] = useState<StandingsProps>(
        parsedStorageData?.standings || []
    )

    useDocumentTitle()
    useFocusTrap()

    return (
        <div className="min-h-svh flex flex-col items-center justify-start bg-gradient-to-b from-stone-700 to-stone-800">
            <ContextAdmin.Provider value={[isAdmin, setIsAdmin]}>
                <ContextGroups.Provider value={[groups, setGroups]}>
                    <ContextIsLoggedIn.Provider
                        value={[isLoggedIn, setIsLoggedIn]}
                    >
                        <ContextLoggedInUser.Provider
                            value={[loggedInUser, setLoggedInUser]}
                        >
                            <ContextRegisteredTeams.Provider
                                value={[registeredTeams, setRegisteredTeams]}
                            >
                                <ContextSchedule.Provider
                                    value={[schedule, setSchedule]}
                                >
                                    <ContextStandings.Provider
                                        value={[standings, setStandings]}
                                    >
                                        <BrowserRouter>
                                            <Navigation />
                                            <Routes>
                                                <Route
                                                    path="/"
                                                    element={
                                                        isLoggedIn ? null : (
                                                            <Login />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="/groups"
                                                    element={
                                                        isLoggedIn ? (
                                                            <GroupsGenerator />
                                                        ) : (
                                                            <FourOhFour />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="/register-team"
                                                    element={
                                                        isLoggedIn ? (
                                                            <RegisterTeam />
                                                        ) : (
                                                            <FourOhFour />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="/schedule"
                                                    element={
                                                        isLoggedIn ? (
                                                            <Schedule />
                                                        ) : (
                                                            <FourOhFour />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="/standings"
                                                    element={
                                                        isLoggedIn ? (
                                                            <Standings />
                                                        ) : (
                                                            <FourOhFour />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="/teams"
                                                    element={
                                                        isLoggedIn ? (
                                                            <Teams />
                                                        ) : (
                                                            <FourOhFour />
                                                        )
                                                    }
                                                />
                                                <Route
                                                    path="*"
                                                    element={<FourOhFour />}
                                                />
                                            </Routes>
                                            <Footer />
                                        </BrowserRouter>
                                    </ContextStandings.Provider>
                                </ContextSchedule.Provider>
                            </ContextRegisteredTeams.Provider>
                        </ContextLoggedInUser.Provider>
                    </ContextIsLoggedIn.Provider>
                </ContextGroups.Provider>
            </ContextAdmin.Provider>
        </div>
    )
}

export default App
