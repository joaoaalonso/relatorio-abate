import './index.css'

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    type?: 'submit' | 'button' | 'reset';
    variant?: 'primary' | 'secondary';
}

function Button({text, variant = 'primary', type = 'button', onClick}: ButtonProps) {
    function handleOnClick(e: any) {
        if (onClick) {
            onClick()
        }
    }

    return (
        <button
            type={type}
            onClick={handleOnClick}
            className={`button button-${variant}`}
            formNoValidate
        >
            {text}
        </button>
    )
}

export default Button