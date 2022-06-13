import ReactSelect from 'react-select'
import { Controller } from 'react-hook-form'

interface Options {
    label: string;
    value: string;
}

interface SelectProps {
    errors?: any;
    name: string;
    control: any;
    label?: string;
    options: Options[];
    required?: boolean;
    onChange?: (value: string) => void;
}

function Select({ name, label, errors, options, control, onChange, required = false }: SelectProps) {
    const hasError = errors && name && !!errors[name]

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            border: `1px solid ${hasError ? 'red' : 'hsl(0, 0%, 80%)'}`,
        })
    }

    return (
        <div>
            {!!label && 
                <label style={{ fontSize: 14 }}>{label}{required ? '*' : ''}</label>
            }
            <Controller
                name={name}
                control={control}
                rules={{ required }}
                render={({ field: { onChange, value, ref } }) => (
                    <ReactSelect
                        ref={ref}
                        onChange={(val: any) => onChange(val.value)}
                        value={options.find(option => option.value === value)}
                        options={options}
                        placeholder={null}
                        isSearchable={true}
                        styles={customStyles}
                        noOptionsMessage={() => 'Nenhuma opção'} 
                    />
                )}
            />
        </div>
    )
}

export default Select