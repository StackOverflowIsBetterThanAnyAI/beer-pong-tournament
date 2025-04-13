import { FC } from 'react'

type FormHeaderProps = {
    header: string
    subHeader: string
}

const FormHeader: FC<FormHeaderProps> = ({ header, subHeader }) => {
    const subHeaderStyle = 'text-center text-large px-1'
    const subHeaderElement = (() => {
        switch (subHeader) {
            case 'required':
                return (
                    <h2 className={subHeaderStyle}>
                        All fields marked with{' '}
                        <span className="text-red-800">*</span> are required.
                    </h2>
                )
            default:
                return null
        }
    })()

    return (
        <>
            <h1 className="text-center font-semibold text-extra-large">
                {header}
            </h1>
            {subHeaderElement}
        </>
    )
}

export default FormHeader
