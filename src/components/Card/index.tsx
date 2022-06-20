import './styles.css'

import { BiChevronRight } from 'react-icons/bi'

interface CardProps {
    text: string
}

function Card({ text }: CardProps) {
    return (
        <div className='generic-card'>
            <span>{text}</span>
            <BiChevronRight />
        </div>
    )
}

export default Card