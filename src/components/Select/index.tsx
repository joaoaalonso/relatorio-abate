import './index.css'
import { InputHTMLAttributes } from 'react'

interface Options {
    text: string;
    value: string;
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    errors?: any;
    name: string;
    label?: string;
    register?: any;
    options: Options[];
    required?: boolean;
}

function Select({ name, label, errors, options, register, required = false }: SelectProps) {
    function handleRegister() {
        if (register && name) {
            return register(name, { required })
        }
        return {}
    }

    const hasError = errors && !!errors[name]

    return (
        <div className='select-container'>
            {!!label && 
                <label className='select-label'>{label}{required ? '*' : ''}</label>
            }
             <select
                id={`select-${name}`} 
                className={`select ${hasError ? 'select-error' : ''}`}
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