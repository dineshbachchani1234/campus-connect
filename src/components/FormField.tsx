import { useId, type ReactElement } from 'react'
import { cloneElement } from 'react'
import { Label } from '@/components/ui/label'

interface Props {
  label: string
  hint?: string
  error?: string
  /** One input element, e.g. <Input /> or <Textarea /> */
  children: ReactElement<Record<string, unknown>>
}

/**
 * Label + input + hint/error, wired for accessibility.
 * Feedback #2: paper had no text entry affordance. Real inputs with visible
 * focus rings and inline errors fix that.
 */
export function FormField({ label, hint, error, children }: Props) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {cloneElement(children, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
