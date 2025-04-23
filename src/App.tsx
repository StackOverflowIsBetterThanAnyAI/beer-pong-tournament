import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/footer/Footer'
import FourOhFour from './404/FourOhFour'
import GroupsGenerator from './components/groups/GroupsGenerator'
import Login from './components/login/Login'
import Navigation from './components/navigation/Navigation'
import RegisterTeam from './components/registerTeam/RegisterTeam'
import Schedule from './components/schedule/Schedule'
import Teams from './components/teams/Teams'
import { ContextIsLoggedIn, ContextLoggedInUser } from './context/ContextLogin'
import { ContextRegisteredTeams } from './context/ContextRegisteredTeams'
import {
    LoggedInUserProps,
    RegisteredTeamsProps,
    ScheduleProps,
    TournamentGroupsProps,
} from './types/types'
import { getStoredData } from './utils/getStoredData'
import { useFocusTrap } from './hooks/useFocusTrap'
import { ContextGroups } from './context/ContextGroups'
import { ContextSchedule } from './context/ContextSchedule'

const App = () => {
    const parsedStorageData = getStoredData()

    const [groups, setGroups] = useState<TournamentGroupsProps>(
        parsedStorageData?.groups || []
    )
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(
        parsedStorageData?.isloggedin || false
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

    useFocusTrap()

    return (
        <div className="min-h-svh flex flex-col items-center justify-start bg-gradient-to-b from-stone-700 to-stone-800">
            <ContextGroups.Provider value={[groups, setGroups]}>
                <ContextIsLoggedIn.Provider value={[isLoggedIn, setIsLoggedIn]}>
                    <ContextLoggedInUser.Provider
                        value={[loggedInUser, setLoggedInUser]}
                    >
                        <ContextRegisteredTeams.Provider
                            value={[registeredTeams, setRegisteredTeams]}
                        >
                            <ContextSchedule.Provider
                                value={[schedule, setSchedule]}
                            >
                                <BrowserRouter>
                                    <Navigation />
                                    <Routes>
                                        <Route
                                            path="/"
                                            element={
                                                isLoggedIn ? null : <Login />
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
                                            path="/register"
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
                                            path="/register"
                                            element={
                                                isLoggedIn ? (
                                                    <RegisterTeam />
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
                            </ContextSchedule.Provider>
                        </ContextRegisteredTeams.Provider>
                    </ContextLoggedInUser.Provider>
                </ContextIsLoggedIn.Provider>
            </ContextGroups.Provider>
        </div>
    )
}

export default App
