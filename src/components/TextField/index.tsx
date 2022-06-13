import './index.css'

import MaskedInput from 'react-maskedinput'
import { Controller } from 'react-hook-form'

declare global {
    interface Window { __TAURI__: any; }
}

interface TextFieldProps {
    errors?: any;
    name?: string;
    type?: string;
    value?: string;
    label?: string;
    register?: any;
    required?: boolean;
    disabled?: boolean;
    control?: any;
    mask?: string
    placeholder?: string;
    onChange?: (value: string) => void;
}

function TextField({ 
    value, 
    name, 
    label, 
    errors, 
    mask, 
    control, 
    placeholder, 
    register, 
    onChange, 
    type = 'text', 
    required = false,
    disabled = false
}: TextFieldProps) {
    const registerConfigs = !!(register && name) ? register(name, { required }) : {};

    function handleOnChange(e: any) {
        if (onChange) {
            onChange(e.target.value)
        }
    }

    async function handleKeyDown(event: KeyboardEvent) {
        const charCode = String.fromCharCode(event.which).toLowerCase();
        const control = event.ctrlKey || event.metaKey
        if (control) {
            event.preventDefault()
            let inputValue = value || ''
            let inputHandler = onChange
            const element = document.getElementsByName(registerConfigs.name)?.[0] as HTMLInputElement
            if (element) {
                inputValue = element.value
                inputHandler = (text: string) => element.value += text
            }
            if (charCode === 'c') window.__TAURI__.clipboard.writeText(inputValue)
            else if(charCode === 'v') window.__TAURI__.clipboard.readText().then(inputHandler)
            else if(charCode === 'x') document.execCommand('cut')
            else if(charCode === 'a') document.execCommand('selectAll')
            return
        }
        const allowed = [
            'Backspace',
            'Tab',
            'CapsLock'
        ]
        if (allowed.includes(event.code)) return
        if (
            type === 'decimal' && !event.key.match(/^[0-9,]*$/) ||
            type === 'integer' && !event.key.match(/^[0-9]*$/)
        ) {
            event.preventDefault()
        }
    }

    const hasError = errors && name && !!errors[name]

    const Tag = type == 'textarea' ? 'textarea' : 'input'

    function renderInput() {
        if (mask && name && control) {
            return (
                <Controller
                    control={control}
                    name={name}
                    rules={{ required }}
                    render={({ field: { onChange, value, ref } }) => (
                        <MaskedInput
                            ref={ref}
                            className={`text-field ${hasError ? 'text-field-error' : ''}`}
                            onChange={onChange}
                            value={value}
                            mask={mask}
                            disabled={disabled}
                        />
                    )}
                />
            )
        }

        return (
            <Tag
                rows={3}
                value={value}
                className={`text-field ${hasError ? 'text-field-error' : ''}`}
                placeholder={placeholder}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                {...registerConfigs}
            />
        )
    }

    return (
        <div className='text-field-container'>
            {!!label && 
                <label className='text-field-label'>{label}{required ? '*' : ''}</label>
            }
            {renderInput()}
        </div>
    )
}

export default TextField