import React from 'react'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'ink' | 'lime' | 'ghost'
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    type?: 'button' | 'submit'
}

export default function Button({
    children,
    variant = 'ink',
    fullWidth = false,
    loading = false,
    disabled = false,
    onClick,
    type = 'button'
}: ButtonProps) {

    const base = `
    flex items-center justify-center gap-2
    px-6 py-4 rounded-2xl
    font-bold text-base 
    transition-all duration-150 
    disabled:opacity-40 disabled:cursor-not-allowed 
    ${fullWidth ? 'w-full' : ''}
    `

    const variants = {
        ink: 'bg-ink text-white hover:bg-ink/80',
        lime: 'bg-lime text-ink hover:bg-lime/80',
        ghost: 'bg-ghost text-mid hover:bg-surface2'
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${base} ${variants[variant]}`}
        >
            {children}
        </button>
    )
}