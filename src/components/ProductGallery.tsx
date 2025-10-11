import { useState } from 'react'
import type { MediaImage } from '../types'

export default function ProductGallery({ images }: { images: MediaImage[] }) {
  const [index, setIndex] = useState(0)
  const active = images[index]

  return (
    <div className="w-full">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {active ? (
          <img src={active.url} alt={active.alt} className="h-full w-full object-contain" />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative aspect-square overflow-hidden rounded border ${i === index ? 'ring-2 ring-brand-500' : 'border-gray-200'}`}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

