import { InputHTMLAttributes } from 'react';
import './index.css'

interface TextFieldProps {
    errors?: any;
    name?: string;
    type?: string;
    value?: string;
    label?: string;
    register?: any;
    required?: boolean;
    placeholder?: string;
    onChange?: (value: string) => void;
}

function TextField({ value, name, label, errors, placeholder, register, onChange, type = 'text', required = false }: TextFieldProps) {
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
        if (control) {
            event.preventDefault()
            if (charCode === 'c') document.execCommand('copy')
            else if(charCode === 'v') document.execCommand('paste')
            else if(charCode === 'x') document.execCommand('cut')
            else if(charCode === 'a') document.execCommand('selectAll')
            return
        }
        if (event.code === 'Backspace') return
        if (
            type === 'decimal' && !event.key.match(/^[0-9,]*$/) ||
            type === 'integer' && !event.key.match(/^[0-9]*$/)
        ) {
            event.preventDefault()
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
                value={value}
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