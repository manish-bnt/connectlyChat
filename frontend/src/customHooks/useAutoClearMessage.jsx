import { useEffect } from "react";

export default function useAutoClearMessage(message, setMessage, delay = 2000) {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setMessage(null)
    }, delay)

    return () => clearTimeout(timer)
  }, [message, delay, setMessage])

}
