import './styles.css'

import { Slaughterhouse } from '../../../services/slaughterhouse'

interface SlaughterhouseCardProps {
    slaughterhouse: Slaughterhouse
}

function SlaughterhouseCard({ slaughterhouse }: SlaughterhouseCardProps) {
    return (
        <div className='slaughterhouse-card'>
            {slaughterhouse.name}
        </div>
    )
}

export default SlaughterhouseCard