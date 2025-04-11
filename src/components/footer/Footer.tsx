const Footer = () => {
    const date = new Date()
    const year = date.getFullYear()

    return (
        <footer className="flex flex-col gap-y-2 w-full max-w-5xl text-pretty text-center text-small text-zinc-100 pb-2 pt-4 px-4 mb-1 mt-auto">
            <span>
                Copyright &#169; {year} Michael Münzenhofer. All Rights
                Reserved.
            </span>
            <a href="/" className="w-fit px-4 py-1 rounded-sm m-auto underline">
                GitHub Repository
            </a>
        </footer>
    )
}

export default Footer
