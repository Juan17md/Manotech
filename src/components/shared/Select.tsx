'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'

type Option = { value: string; label: string }

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  icon?: React.ReactNode
  accentColor?: 'cyan' | 'coral' | 'emerald' | 'amber'
  className?: string
  disabled?: boolean
}

const accentBorderMap = {
  cyan: 'border-acento-primario/50 ring-4 ring-acento-primario/10',
  coral: 'border-peligro/50 ring-4 ring-peligro/10',
  emerald: 'border-exito/50 ring-4 ring-exito/10',
  amber: 'border-acento-aviso/50 ring-4 ring-acento-aviso/10',
}

const accentActiveMap = {
  cyan: 'bg-acento-primario/15 text-acento-primario',
  coral: 'bg-peligro/15 text-peligro',
  emerald: 'bg-exito/15 text-exito',
  amber: 'bg-acento-aviso/15 text-acento-aviso',
}

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  icon,
  accentColor = 'cyan',
  className = '',
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(false)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})

  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedIndex = options.findIndex(o => o.value === value)
  const selectedOption = options.find(o => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        listRef.current &&
        !listRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updatePosition = useCallback(() => {
    if (!open || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const dropdownHeight = options.length * 49 + 16

    if (spaceBelow >= dropdownHeight) {
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 6}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      })
    } else {
      setDropdownStyle({
        position: 'fixed',
        bottom: `${window.innerHeight - rect.top + 6}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999,
      })
    }
  }, [open, options.length])

  useEffect(() => {
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [updatePosition])

  function handleSelect(opt: Option) {
    onChange(opt.value)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(prev => !prev)
      return
    }

    if (e.key === 'Escape') {
      setOpen(false)
      return
    }

    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = Math.min(selectedIndex + 1, options.length - 1)
        if (next >= 0) onChange(options[next].value)
        scrollToIndex(next)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = Math.max(selectedIndex - 1, 0)
        onChange(options[prev].value)
        scrollToIndex(prev)
        return
      }
    }
  }

  function scrollToIndex(index: number) {
    requestAnimationFrame(() => {
      if (!listRef.current) return
      const item = listRef.current.children[index] as HTMLElement
      if (item) item.scrollIntoView({ block: 'nearest' })
    })
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen(prev => !prev)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center gap-2 bg-fondo-principal border rounded-xl px-4 py-3 text-left transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed ${focus && open ? accentBorderMap[accentColor] : 'border-borde-sutil hover:border-acento-primario/30'} ${icon ? 'pl-11' : ''}`}
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-texto-secundario">
            {icon}
          </div>
        )}
        <span className={`flex-1 truncate ${selectedOption ? 'text-texto-primario' : 'text-texto-secundario'}`}>
          {selectedOption ? selectedOption.label : (placeholder || 'Seleccionar')}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-texto-secundario transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && createPortal(
        <div
          ref={listRef}
          style={dropdownStyle}
          className="z-[100] min-w-[160px] bg-superficie border border-borde-sutil rounded-xl shadow-2xl backdrop-blur-2xl animate-in fade-in duration-150"
        >
          {options.length === 0 && (
            <div className="px-4 py-3 text-sm text-texto-secundario text-center">Sin opciones</div>
          )}
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onMouseDown={() => handleSelect(opt)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors
                  ${isSelected ? `${accentActiveMap[accentColor]} font-semibold` : 'text-texto-primario hover:bg-superficie-hover'}
                  ${i > 0 ? 'border-t border-borde-sutil/70' : ''}`}
              >
                <span className={`w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors
                  ${isSelected ? `${accentBorderMap[accentColor].split(' ')[0]} bg-current` : 'border-borde-sutil'}`}
                >
                  {isSelected && <Check size={10} className="text-fondo-principal" />}
                </span>
                <span className="flex-1 truncate">{opt.label}</span>
              </button>
            )
          })}
        </div>,
        document.body
      )}
    </div>
  )
}
