import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Footer from './components/footer/Footer'
import FourOhFour from './404/FourOhFour'
import Login from './components/login/Login'
import Navigation from './components/navigation/Navigation'
import RegisterTeam from './components/registerTeam/RegisterTeam'
import Teams from './components/teams/Teams'
import {
    ContextIsLoggedIn,
    ContextLoggedInUser,
    LoggedInUserProps,
} from './context/LoginContext'
import { useFocusTrap } from './hooks/useFocusTrap'

const App = () => {
    const storedData = localStorage.getItem('beer-pong-tournament')
    const parsedStorageData = storedData ? JSON.parse(storedData) : {}

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>(
        parsedStorageData?.isloggedin || false
    )
    const [loggedInUser, setLoggedInUser] = useState<
        LoggedInUserProps | undefined
    >({
        user: parsedStorageData?.username || '',
        token: parsedStorageData?.token || '',
    })

    useFocusTrap()

    return (
        <div className="min-h-svh flex flex-col items-center justify-start bg-gradient-to-b from-stone-700 to-stone-800">
            <ContextIsLoggedIn.Provider value={[isLoggedIn, setIsLoggedIn]}>
                <ContextLoggedInUser.Provider
                    value={[loggedInUser, setLoggedInUser]}
                >
                    <BrowserRouter>
                        <Navigation />
                        <Routes>
                            <Route
                                path="/"
                                element={isLoggedIn ? <Teams /> : <Login />}
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
                </ContextLoggedInUser.Provider>
            </ContextIsLoggedIn.Provider>
        </div>
    )
}

export default App
