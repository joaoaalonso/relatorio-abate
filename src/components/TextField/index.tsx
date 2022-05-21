import { InputHTMLAttributes } from 'react';
import './index.css'

interface TextFieldProps {
    errors?: any;
    name?: string;
    value?: string;
    label?: string;
    register?: any;
    required?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
}

function TextField({ value, name, label, errors, placeholder, register, onChange, required = false }: TextFieldProps) {
    function handleRegister() {
        if (register && name) {
            return register(name, { required })
        }
        return {}
    }

    function handleOnChage(e: any) {
        if (onChange) {
            onChange(e.target.value)
        }
    }

    const hasError = errors && name && !!errors[name]

    return (
        <div className='text-field-container'>
            {!!label && 
                <label className='text-field-label'>{label}{required ? '*' : ''}</label>
            }
            <input
                value={value}
                className={`text-field ${hasError ? 'text-field-error' : ''}`}
                placeholder={placeholder}
                onChange={handleOnChage}
                {...handleRegister()}
            />
        </div>
    )
}

export default TextField