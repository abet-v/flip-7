import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, Ref } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
}

export default function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 text-base font-body',
        'bg-white border-2 border-foreground rounded-[16px]',
        'shadow-[2px_2px_0px_var(--color-foreground)]',
        'focus:shadow-hard focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px]',
        'transition-all duration-150',
        'placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
