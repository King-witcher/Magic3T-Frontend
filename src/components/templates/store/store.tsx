import { getIconUrl } from '@/utils/utils'
import { range } from 'lodash'

export const a = 3

const icons = [...range(1000, 1100)]

export function StoreTemplate() {
  return (
    <main>
      <h1 className="!text-[6vw] sm:!text-4xl font-serif !font-semibold text-gold-4 uppercase text-tred">
        Icon store
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {icons.map((icon) => (
          <div key={icon} className="acrylic overflow-hidden shadow-md">
            <img alt={`Icon ${icon}`} src={getIconUrl(icon)} />

            <h2 className="text-xl font-semibold">Item {icon}</h2>
            <p className="text-sm text-gray-600">Description of item {icon}</p>
            <button
              type="button"
              className="bg-gold-4 text-white px-4 py-2 rounded-lg mt-2"
            >
              Add to cart
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
