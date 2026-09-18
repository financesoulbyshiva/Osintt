import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from '@/components/Icon'

export function Field({ label, children, hint }: { label?: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      {label && <span className="label">{label}</span>}
      {children}
      {hint && <span className="text-muted" style={{ fontSize: 11.5 }}>{hint}</span>}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean
}
export function Input({ mono, className = '', ...rest }: InputProps) {
  return <input className={`input${mono ? ' input--mono' : ''} ${className}`} {...rest} />
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className = '', ...rest }: TextareaProps) {
  return <textarea className={`textarea ${className}`} {...rest} />
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}
export function Select({ options, className = '', ...rest }: SelectProps) {
  return (
    <select className={`select ${className}`} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onValueChange: (v: string) => void
  mono?: boolean
}
export function SearchBar({ value, onValueChange, mono, className = '', ...rest }: SearchBarProps) {
  return (
    <div className={`searchbar ${className}`}>
      <span className="searchbar__icon"><Icon name="search" size={16} /></span>
      <input
        className={`input${mono ? ' input--mono' : ''}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        {...rest}
      />
      {value && (
        <button
          type="button"
          className="icon-btn searchbar__clear"
          style={{ width: 24, height: 24 }}
          onClick={() => onValueChange('')}
          aria-label="Clear search"
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  )
}
