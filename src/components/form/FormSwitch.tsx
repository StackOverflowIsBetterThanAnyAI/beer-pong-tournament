type FormSwitchProps = {
    isSigningUp: boolean
    handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const FormSwitch = ({ isSigningUp, handleClick }: FormSwitchProps) => {
    const loginStyle = isSigningUp
        ? 'bg-stone-500/40 hover:bg-stone-400/40 active:bg-red-200'
        : 'bg-red-500/80'

    const signupStyle = isSigningUp
        ? 'bg-red-500/80'
        : 'bg-stone-500/40 hover:bg-stone-400/40 active:bg-red-200'

    return (
        <div className="flex justify-center text-normal py-2">
            <button
                aria-label={`Switch to ${
                    isSigningUp ? 'Login' : 'Signup'
                }. Currently, ${isSigningUp ? 'Signup' : 'Login'} is selected.`}
                className="flex outline-stone-100 outline-2 rounded-lg
                focus-visible:outline-offset-1"
                onClick={handleClick}
                title={`Switch to ${
                    isSigningUp ? 'Login' : 'Signup'
                }. Currently, ${isSigningUp ? 'Signup' : 'Login'} is selected.`}
            >
                <div
                    className={`${loginStyle} w-16 md:w-20 rounded-l-lg transition duration-500 ease-in-out pl-4 pr-2 py-1`}
                >
                    Login
                </div>
                <div
                    className={`${signupStyle} w-16 md:w-20 rounded-r-lg transition duration-500 ease-in-out pl-2 pr-4 py-1`}
                >
                    Signup
                </div>
            </button>
        </div>
    )
}

export default FormSwitch
