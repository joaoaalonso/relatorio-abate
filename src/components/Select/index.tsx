import './index.css'
import { InputHTMLAttributes } from 'react'

interface Options {
    text: string;
    value: string;
}

interface SelectProps {
    errors?: any;
    name?: string;
    label?: string;
    register?: any;
    options: Options[];
    required?: boolean;
    onChange?: (value: string) => void;
}

function Select({ name, label, errors, options, register, onChange, required = false }: SelectProps) {
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
        <div className='select-container'>
            {!!label && 
                <label className='select-label'>{label}{required ? '*' : ''}</label>
            }
             <select
                id={`select-${name}`} 
                className={`select ${hasError ? 'select-error' : ''}`}
                onChange={handleOnChage}
                {...handleRegister()}
             >
                {options.map(option => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.text}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select