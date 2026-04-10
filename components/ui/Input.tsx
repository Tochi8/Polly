interface InputProps {
    label?: string
    placeholder?: string
    value: string
    onChange: (val: string) => void
    error?: string
    disabled?: boolean
    type?: string
    children: React.ReactNode
}

export default function Input({
    label,
    placeholder,
    value,
    error,
    disabled,
    onChange,
    type = 'text',
    children
}: InputProps) {

   return (
    <div className="flex flex-col gap-1.5">

        {label && ( 
         <label htmlFor="" className="text-xs font-bold uppercase
          tracking-wide text-mid">
            {label}
        </label>
    )}

    <input 
    type={type}
    placeholder={placeholder}
    value={value}
    disabled={disabled}
    children={children}
    onChange={e => onChange(e.target.value)}
    className={`
        w-full px-4 py-3 rounded-xl text-sm font-medium
        bg-surface border-2 outline-none
        transition-all duration-150
        ${error
            ? 'border-red-400 bg-red-50'
            : 'border-transparent focus:border-ink focus:bg-white'
        }
        `}
    />

    {error && (
        <p className="text-xs text-red-500 font-medium">
            {error}
        </p>
    )}

    </div>
   );
}