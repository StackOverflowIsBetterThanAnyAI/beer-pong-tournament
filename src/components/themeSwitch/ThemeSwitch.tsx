import { useEffect, useState } from 'react'
import { DarkIcon } from './DarkIcon'
import { LightIcon } from './LightIcon'
import { getStoredData } from '../../utils/getStoredData'
import { setItemInStorage } from '../../utils/setItemInStorage'

const ThemeSwitch = () => {
    const parsedStorageData = getStoredData()

    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        parsedStorageData?.isdarkmode ?? false
    )

    useEffect(() => {
        if (parsedStorageData?.isdarkmode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [parsedStorageData?.isdarkmode])

    const handleClick = () => {
        document.body.classList.toggle('dark')
        const isDark = document.body.classList.contains('dark')
        setIsDarkMode(isDark)
        setItemInStorage('isdarkmode', isDark)
    }

    return (
        <button
            className="h-8 w-16 rounded-4xl transition-[background] duration-300 bg-stone-400 dark:bg-stone-500 hover:bg-stone-500/70"
            onClick={handleClick}
            title={`Switch Theme to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch Theme to ${
                isDarkMode ? 'Light' : 'Dark'
            } Mode - Currently using ${isDarkMode ? 'Dark' : 'Light'} Mode`}
        >
            <div className="h-6 w-6 m-1 rounded-full transition-all duration-300 dark:translate-x-8">
                {isDarkMode ? <DarkIcon /> : <LightIcon />}
            </div>
        </button>
    )
}

export default ThemeSwitch
