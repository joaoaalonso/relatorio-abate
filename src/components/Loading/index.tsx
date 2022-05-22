import './index.css'

import { AiOutlineLoading3Quarters } from 'react-icons/ai'

interface LoadingProps {
    text?: string;
    loading: boolean;
}

function Loading({ text = 'Carregando...', loading }: LoadingProps) {
    return (
        <div 
            className='loading-container' 
            style={{ display: loading ? 'flex' : 'none' }}
        >
            <div className='loading-wrapper'>
                <span>{text}</span>
                <AiOutlineLoading3Quarters size={25} />
            </div>
        </div>
    )
}

export default Loading