import { useEffect, useState } from 'react'

export function useKeyboardInset(active: boolean): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    if (!active) {
      setInset(0)
      return
    }

    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      setInset(Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop))
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)

    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      setInset(0)
    }
  }, [active])

  return inset
}
