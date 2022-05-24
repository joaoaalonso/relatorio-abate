import './index.css'

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
    placeholder?: string;
    onChange?: (value: string) => void;
}

function TextField({ value, name, label, errors, placeholder, register, onChange, type = 'text', required = false }: TextFieldProps) {
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
                {...registerConfigs}
            />
        </div>
    )
}

export default TextField