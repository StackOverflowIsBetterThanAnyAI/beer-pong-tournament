import { useEffect, useState } from 'react'
import { getStoredData } from '../../utils/getStoredData'
import { setItemInStorage } from '../../utils/setItemInStorage'

const ThemeSwitch = () => {
    const parsedStorageData = getStoredData()

    useEffect(() => {
        if (parsedStorageData?.isdarkmode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    }, [])

    const [isDarkMode, setIsDarkMode] = useState<boolean>(
        parsedStorageData?.isdarkmode ?? false
    )

    const handleClick = () => {
        document.body.classList.toggle('dark')
        const isDark = document.body.classList.contains('dark')
        setIsDarkMode(isDark)
        setItemInStorage('isdarkmode', isDark)
    }

    const darkIcon = (
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path
                fill="#f5f5f4"
                stroke="#292524"
                strokeWidth="2"
                d="m32.8,29.3c-8.9-.8-16.2-7.8-17.5-16.6-.3-1.8-.3-3.7,0-5.4.2-1.4-1.4-2.3-2.5-1.6C6.3,9.7,2.1,16.9,2.5,25c.5,10.7,9,19.5,19.7,20.4,10.6.9,19.8-6,22.5-15.6.4-1.4-1-2.6-2.3-2-2.9,1.3-6.1,1.8-9.6,1.5Z"
            />
        </svg>
    )

    const lightIcon = (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V4C12.75 4.41421 12.4142 4.75 12 4.75C11.5858 4.75 11.25 4.41421 11.25 4V2C11.25 1.58579 11.5858 1.25 12 1.25ZM3.66865 3.71609C3.94815 3.41039 4.42255 3.38915 4.72825 3.66865L6.95026 5.70024C7.25596 5.97974 7.2772 6.45413 6.9977 6.75983C6.7182 7.06553 6.2438 7.08677 5.9381 6.80727L3.71609 4.77569C3.41039 4.49619 3.38915 4.02179 3.66865 3.71609ZM20.3314 3.71609C20.6109 4.02179 20.5896 4.49619 20.2839 4.77569L18.0619 6.80727C17.7562 7.08677 17.2818 7.06553 17.0023 6.75983C16.7228 6.45413 16.744 5.97974 17.0497 5.70024L19.2718 3.66865C19.5775 3.38915 20.0518 3.41039 20.3314 3.71609ZM12 7.75C9.65279 7.75 7.75 9.65279 7.75 12C7.75 14.3472 9.65279 16.25 12 16.25C14.3472 16.25 16.25 14.3472 16.25 12C16.25 9.65279 14.3472 7.75 12 7.75ZM6.25 12C6.25 8.82436 8.82436 6.25 12 6.25C15.1756 6.25 17.75 8.82436 17.75 12C17.75 15.1756 15.1756 17.75 12 17.75C8.82436 17.75 6.25 15.1756 6.25 12ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H4C4.41421 11.25 4.75 11.5858 4.75 12C4.75 12.4142 4.41421 12.75 4 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM19.25 12C19.25 11.5858 19.5858 11.25 20 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H20C19.5858 12.75 19.25 12.4142 19.25 12ZM17.0255 17.0252C17.3184 16.7323 17.7933 16.7323 18.0862 17.0252L20.3082 19.2475C20.6011 19.5404 20.601 20.0153 20.3081 20.3082C20.0152 20.6011 19.5403 20.601 19.2475 20.3081L17.0255 18.0858C16.7326 17.7929 16.7326 17.3181 17.0255 17.0252ZM6.97467 17.0253C7.26756 17.3182 7.26756 17.7931 6.97467 18.086L4.75244 20.3082C4.45955 20.6011 3.98468 20.6011 3.69178 20.3082C3.39889 20.0153 3.39889 19.5404 3.69178 19.2476L5.91401 17.0253C6.2069 16.7324 6.68177 16.7324 6.97467 17.0253ZM12 19.25C12.4142 19.25 12.75 19.5858 12.75 20V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V20C11.25 19.5858 11.5858 19.25 12 19.25Z"
                fill="#f5f5f4"
            ></path>
        </svg>
    )

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
                {isDarkMode ? darkIcon : lightIcon}
            </div>
        </button>
    )
}

export default ThemeSwitch
