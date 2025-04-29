type SuccessProps = { triggered: boolean }

const Success = ({ triggered }: SuccessProps) => {
    const opacity = triggered ? 'opacity-90' : 'opacity-0'

    return (
        <div
            className={`text-normal bg-green-500 text-stone-900/95 absolute bottom-6 left-6 rounded-sm
                outline-1 outline-zinc-50 p-2 transition-[opacity] duration-700 ${opacity}`}
            role="status"
            aria-live="polite"
        >
            Successfully registered Team!
        </div>
    )
}

export default Success
