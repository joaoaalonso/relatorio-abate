import './index.css'
import 'react-datepicker/dist/react-datepicker.css'

import ptBr from 'date-fns/locale/pt-BR'
import MaskedInput from 'react-maskedinput'
import { Controller } from 'react-hook-form'
import ReactDatePicker, {registerLocale} from 'react-datepicker'


interface DatePickerProps {
    errors?: any;
    name: string;
    control: any;
    label?: string;
    required?: boolean;
    onChange?: (val: string) => void;
}

function DatePicker({ label, name, errors, control, required = false }: DatePickerProps) {
    registerLocale('pt-BR', ptBr)
    
    const hasError = errors && name && !!errors[name]

    return (
        <div className='text-field-container'>
            {!!label && 
                <label className='text-field-label'>{label}{required ? '*' : ''}</label>
            }

            <Controller
                control={control}
                name={name}
                rules={{ required }}
                render={({ field: { onChange, value, ref } }) => (
                    <ReactDatePicker
                        ref={ref}
                        className={hasError ? 'error' : ''}
                        onChange={onChange}
                        selected={value ? new Date(value) : null}
                        locale='pt-BR'
                        dateFormat='dd/MM/yyyy'
                        customInput={
                            <MaskedInput mask='11/11/1111' />
                        }
                    />
                )}
            />
        </div>
    )
}

export default DatePicker