import { InputHTMLAttributes } from 'react';
import './index.css'

interface TextFieldProps {
    errors?: any;
    name?: string;
    type?: string;
    step?: string;
    value?: string;
    label?: string;
    register?: any;
    required?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
}

function TextField({ value, name, label, errors, placeholder, register, onChange, step, type = 'text', required = false }: TextFieldProps) {
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

    const Tag = type == 'textarea' ? 'textarea' : 'input'

    return (
        <div className='text-field-container'>
            {!!label && 
                <label className='text-field-label'>{label}{required ? '*' : ''}</label>
            }
            <Tag
                rows={3}
                type={type}
                value={value}
                step={step}
                className={`text-field ${hasError ? 'text-field-error' : ''}`}
                placeholder={placeholder}
                onChange={handleOnChage}
                {...handleRegister()}
            />
        </div>
    )
}

export default TextField