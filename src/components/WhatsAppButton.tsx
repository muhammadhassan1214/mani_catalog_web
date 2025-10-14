// filepath: d:\Beauty-Catelog\catalog-frontend\src\components\WhatsAppButton.tsx
import { MessageCircle } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function WhatsAppButton() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null

  const phone = '6282131671736' // +62 821 3167 1736 without plus and spaces
  const href = `https://wa.me/${phone}?text=Hello%20Alisha%20Beauties`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg px-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      <span className="whitespace-nowrap text-sm font-medium opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[200px] transition-all duration-200 overflow-hidden">
        WhatsApp
      </span>
    </a>
  )
}
