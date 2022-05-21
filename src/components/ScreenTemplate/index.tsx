import './index.css'
import { Link } from 'react-router-dom'
import { BiChevronLeft } from 'react-icons/bi'

interface ScreenTemplateProps {
    title?: string
    backLink?: string
    children: JSX.Element
}

function ScreenTemplate({ title, children, backLink }: ScreenTemplateProps) {
    return (
        <div className='main-content'>
            <div className='top-bar'>
                <>
                    {!!backLink && (
                        <Link to={backLink}>
                            <BiChevronLeft size={25} />
                        </Link>
                    )}
                    {title}
                </>
            </div>
            <div className='content-wrapper'>
                <div className='content'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ScreenTemplate