import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/footer/Footer'
import FourOhFour from './404/FourOhFour'
import GroupsGenerator from './groups/GroupsGenerator'
import Login from './components/login/Login'
import Navigation from './components/navigation/Navigation'
import RegisterTeam from './components/registerTeam/RegisterTeam'
import Teams from './components/teams/Teams'
import { ContextIsLoggedIn, ContextLoggedInUser } from './context/ContextLogin'
import { ContextRegisteredTeams } from './context/ContextRegisteredTeams'
import { LoggedInUserProps, RegisteredTeamsProps } from './types/tpyes'
import { getStoredData } from './utils/getStoredData'
import { useFocusTrap } from './hooks/useFocusTrap'

const App = () => {
    const parsedStorageData = getStoredData()

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

    useFocusTrap()

    return (
        <div className="min-h-svh flex flex-col items-center justify-start bg-gradient-to-b from-stone-700 to-stone-800">
            <ContextIsLoggedIn.Provider value={[isLoggedIn, setIsLoggedIn]}>
                <ContextLoggedInUser.Provider
                    value={[loggedInUser, setLoggedInUser]}
                >
                    <ContextRegisteredTeams.Provider
                        value={[registeredTeams, setRegisteredTeams]}
                    >
                        <BrowserRouter>
                            <Navigation />
                            <Routes>
                                <Route
                                    path="/"
                                    element={isLoggedIn ? null : <Login />}
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
                                    path="/teams"
                                    element={
                                        isLoggedIn ? <Teams /> : <FourOhFour />
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
                                <Route path="*" element={<FourOhFour />} />
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </ContextRegisteredTeams.Provider>
                </ContextLoggedInUser.Provider>
            </ContextIsLoggedIn.Provider>
        </div>
    )
}

export default App
