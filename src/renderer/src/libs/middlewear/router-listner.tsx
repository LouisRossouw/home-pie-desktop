import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export function RouterListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (_event: any, { url }: { url: string }) => {
      if (url) {
        navigate(url)
      }
    }

    window.api.navigateTo(handler)
  }, [])

  return null
}
