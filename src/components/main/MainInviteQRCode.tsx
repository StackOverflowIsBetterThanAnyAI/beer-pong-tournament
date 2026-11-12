import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

const MainInviteQRCode = () => {
    const signupUrl = `${window.location.origin}/`
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleDownload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'beer-pong-tournament-signup.png'
        link.click()
    }

    return (
        <figure
            className="flex flex-col items-center gap-2 mt-4 lg:mt-6"
            data-testid="invite-qr-code"
        >
            <figcaption className="text-normal font-bold">
                Invite your friends
            </figcaption>
            <div className="w-40 sm:w-44 p-2 rounded-md bg-stone-400/70">
                <QRCodeCanvas
                    ref={canvasRef}
                    value={signupUrl}
                    size={512}
                    marginSize={2}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#292524"
                    style={{ width: '100%', height: 'auto' }}
                    className="block rounded-sm"
                    role="img"
                    aria-label={`QR code linking to the signup page: ${signupUrl}`}
                />
            </div>
            <span className="text-small">
                Scan to sign up or open{' '}
                <a
                    href={signupUrl}
                    className="underline break-all rounded-sm"
                    title="Signup page"
                >
                    {signupUrl}
                </a>
            </span>
            <button
                onClick={handleDownload}
                className="relative text-center w-full max-w-64 mx-auto px-4 py-1 lg:py-1.5 rounded-lg bg-stone-100/90 outline outline-stone-500 active:bg-stone-300 animate-stone-50-stone-300"
                aria-label="Download the QR code as an image."
                title="Download the QR code as an image."
                data-testid="invite-qr-code-download"
            >
                Download QR Code
            </button>
        </figure>
    )
}

export default MainInviteQRCode
