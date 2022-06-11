import './index.css'
import { Link } from 'react-router-dom'
import { BiChevronLeft } from 'react-icons/bi'
import Button from '../Button'

interface ScreenTemplateProps {
    title?: string
    backLink?: string
    children: JSX.Element
    rightComponent?: JSX.Element
    noBackground?: boolean
}

function ScreenTemplate({ title, children, backLink, noBackground, rightComponent }: ScreenTemplateProps) {
    return (
        <div className='main-content'>
            <div className='top-bar'>
                <>
                    {!!backLink && (
                        <Link to={backLink}>
                            <BiChevronLeft size={25} />
                        </Link>
                    )}
                    <div style={{ flex: 1 }}>
                        {title}
                    </div>
                    <div>
                        {rightComponent}
                    </div>
                </>
            </div>
            <div className='content-wrapper'>
                <div className={`content ${noBackground ? '' : 'content-bg'}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default ScreenTemplate