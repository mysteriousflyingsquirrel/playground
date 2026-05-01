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
  'm-0 cursor-pointer rounded-lg border border-border bg-surface px-2.5 py-2 font-inherit text-sm font-semibold text-fg shadow-ds-sm transition-[border-color,box-shadow,background-color] duration-200 hover:border-secondary/45 hover:shadow-ds-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]'

const sliderIconBtn = 'inline-flex min-h-10 min-w-10 items-center justify-center p-1.5 tabular-nums leading-none'

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ImageSlider({ title, images }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const goPrev = () => setIndex((i) => (i - 1 + count) % count)
  const goNext = () => setIndex((i) => (i + 1) % count)

  return (
    <div className="relative border-b border-border">
      <div className="relative aspect-[720/448] overflow-hidden bg-muted-bg">
        <img
          className="block h-full w-full object-cover transition-opacity duration-300"
          src={images[index]}
          alt={`${title} — photo ${index + 1} of ${count}`}
          width={720}
          height={448}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface px-3 py-3">
        <button type="button" className={cn(sliderBtn, sliderIconBtn)} onClick={goPrev} aria-label="Previous photo">
          <ChevronLeft />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2" role="tablist" aria-label="Photos">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show photo ${i + 1}`}
              className={cn(
                'h-2.5 w-2.5 cursor-pointer rounded-full border-0 p-0 transition-[background-color,box-shadow] duration-200',
                'bg-border hover:bg-secondary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]',
                i === index &&
                  'bg-accent shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]',
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className={cn(sliderBtn, sliderIconBtn)} onClick={goNext} aria-label="Next photo">
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default function Apartments() {
  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Listings</p>
          <h1 className="ds-page-title">Example stays</h1>
          <p className="ds-page-lede">
            Three sample listings with short descriptions and photo carousels—similar to what a guest would see when browsing
            apartments.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] items-stretch gap-6 lg:gap-8">
        {apartments.map((apt) => (
          <article
            key={apt.title}
            className="ds-card-interactive flex min-w-0 flex-col overflow-hidden border-2 border-transparent hover:border-secondary/15"
          >
            <ImageSlider title={apt.title} images={apt.images} />
            <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
              <h2 className="mb-2 text-lg font-bold tracking-tight text-fg">{apt.title}</h2>
              <p className="m-0 text-[0.9375rem] leading-relaxed text-muted">{apt.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
