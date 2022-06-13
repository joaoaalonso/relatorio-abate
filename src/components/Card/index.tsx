import './styles.css'

import { BiChevronRight } from 'react-icons/bi'

interface CardProps {
    text: string
}

function Card({ text }: CardProps) {
    return (
        <div className='client-card'>
            <span>{text}</span>
            <BiChevronRight />
        </div>
    )
}

export default Card