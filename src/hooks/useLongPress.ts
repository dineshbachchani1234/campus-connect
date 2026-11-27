import { useRef } from 'react'

/** Returns pointer handlers that call `onLongPress` after holding for `ms` */
export function useLongPress(onLongPress: () => void, ms = 700) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  return {
    onPointerDown: () => {
      clear()
      timer.current = setTimeout(onLongPress, ms)
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    // Stop the phone's copy menu from appearing on a long press
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  }
}
