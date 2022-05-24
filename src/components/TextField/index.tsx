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

    function handleOnChange(e: any) {
        if (onChange) {
            onChange(e.target.value)
        }
    }

    function handleKeyDown(event: any) {
        const charCode = String.fromCharCode(event.which).toLowerCase();
        const control = event.ctrlKey || event.metaKey
        if(control && charCode === 'c') {
            event.preventDefault()
            document.execCommand('copy')
        } else if(control && charCode === 'v') {
            event.preventDefault()
            document.execCommand('paste')
        } else if(control && charCode === 'a') {
            event.preventDefault()
            document.execCommand('selectAll')
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
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                {...handleRegister()}
            />
        </div>
    )
}

export default TextField