import { useState } from 'react'
import { cn } from '../cn.js'

const apartments = [
  {
    title: 'Harbor Loft',
    description:
      'Bright corner unit with floor-to-ceiling windows, a compact kitchen, and a small workspace nook. Ideal for two guests who want walkable cafés and evening waterfront strolls.',
    images: [
      'https://picsum.photos/seed/harbor-loft-1/720/448',
      'https://picsum.photos/seed/harbor-loft-2/720/448',
      'https://picsum.photos/seed/harbor-loft-3/720/448',
      'https://picsum.photos/seed/harbor-loft-4/720/448',
      'https://picsum.photos/seed/harbor-loft-5/720/448',
    ],
  },
  {
    title: 'Garden Studio',
    description:
      'Quiet ground-floor studio opening onto a shared courtyard. Includes laundry in the building, reliable Wi‑Fi, and simple self check-in for flexible arrival times.',
    images: [
      'https://picsum.photos/seed/garden-studio-1/720/448',
      'https://picsum.photos/seed/garden-studio-2/720/448',
      'https://picsum.photos/seed/garden-studio-3/720/448',
      'https://picsum.photos/seed/garden-studio-4/720/448',
      'https://picsum.photos/seed/garden-studio-5/720/448',
    ],
  },
  {
    title: 'Skyline One-Bedroom',
    description:
      'Elevated views, a separate bedroom, and a dining table for four. Great for longer stays: full-size fridge, dishwasher, and blackout shades in the bedroom.',
    images: [
      'https://picsum.photos/seed/skyline-bed-1/720/448',
      'https://picsum.photos/seed/skyline-bed-2/720/448',
      'https://picsum.photos/seed/skyline-bed-3/720/448',
      'https://picsum.photos/seed/skyline-bed-4/720/448',
      'https://picsum.photos/seed/skyline-bed-5/720/448',
    ],
  },
]

const sliderBtn =
  'm-0 cursor-pointer rounded-md border border-border bg-bg px-2.5 py-1.5 font-inherit text-sm text-fg transition-colors hover:border-accent-dim hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const sliderIconBtn =
  'inline-flex min-h-9 min-w-9 items-center justify-center p-1.5 text-lg font-semibold tabular-nums leading-none'

function ImageSlider({ title, images }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)

  return (
    <div className="border-b border-border">
      <div className="relative aspect-[720/448] bg-bg">
        <img
          className="block h-full w-full object-cover"
          src={images[index]}
          alt={`${title} — photo ${index + 1} of ${count}`}
          width={720}
          height={448}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-2">
        <button
          type="button"
          className={cn(sliderBtn, sliderIconBtn)}
          onClick={goPrev}
          aria-label="Previous photo"
        >
          {'<'}
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5" role="tablist" aria-label="Photos">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                'h-2 w-2 cursor-pointer rounded-full border-none p-0 transition-[background,transform] hover:bg-muted',
                'bg-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                i === index && 'scale-[1.15] bg-accent',
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className={cn(sliderBtn, sliderIconBtn)}
          onClick={goNext}
          aria-label="Next photo"
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default function Apartments() {
  return (
    <div className="max-w-6xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Example stays</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Three sample listings with short descriptions and photo carousels—similar to what a guest
        would see when browsing apartments.
      </p>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] items-stretch gap-5">
        {apartments.map((apt) => (
          <article
            key={apt.title}
            className="flex min-w-0 flex-col overflow-hidden rounded-[10px] border border-border bg-surface"
          >
            <ImageSlider title={apt.title} images={apt.images} />
            <div className="flex flex-1 flex-col px-[1.1rem] pb-[1.15rem] pt-4">
              <h2 className="mb-2 text-[1.05rem] font-semibold text-fg">{apt.title}</h2>
              <p className="m-0 text-[0.9375rem] leading-[1.55] text-muted">{apt.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
