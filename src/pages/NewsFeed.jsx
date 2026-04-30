import { useState } from 'react'
import { cn } from '../cn.js'

const newsItems = [
  {
    id: 'city-mobility',
    imageUrl: 'https://picsum.photos/seed/news-city-mobility/720/448',
    title: 'City Pilots Electric Bus Lanes',
    headline: 'A six-month pilot opens dedicated lanes to reduce rush-hour delays.',
    content:
      'The transit authority launched a downtown pilot that reserves two major corridors for electric buses during peak commuting hours. Officials expect faster trip times, improved reliability, and lower street-level emissions. Rider feedback and travel-time data will be reviewed before deciding whether to expand the program citywide next year.',
  },
  {
    id: 'coastal-reef',
    imageUrl: 'https://picsum.photos/seed/news-coastal-reef/720/448',
    title: 'Researchers Restore Coastal Reef',
    headline: 'Marine teams report early success after placing new coral fragments.',
    content:
      'A joint university and nonprofit effort transplanted thousands of heat-tolerant coral fragments to a damaged reef shelf last autumn. Early monitoring shows strong attachment rates and signs of fish populations returning to the area. Scientists caution that long-term outcomes still depend on continued water-quality improvements and seasonal temperature swings.',
  },
  {
    id: 'library-labs',
    imageUrl: 'https://picsum.photos/seed/news-library-labs/720/448',
    title: 'Public Libraries Add Maker Labs',
    headline: 'Neighborhood branches introduce free workshops with 3D printers and tools.',
    content:
      'Three library branches opened new maker labs focused on beginner-friendly classes in prototyping, electronics, and digital design. The program includes weekend sessions for students and evening slots for working adults. Library staff say demand was strong in the first week, with most introductory workshops reaching capacity within hours.',
  },
  {
    id: 'health-clinic',
    imageUrl: 'https://picsum.photos/seed/news-health-clinic/720/448',
    title: 'Community Clinic Expands Hours',
    headline: 'Extended evening appointments aim to improve access for families.',
    content:
      'A community health clinic announced extended weekday hours and a new Saturday schedule to address growing demand for primary care. The expansion adds bilingual intake support and telehealth follow-ups for routine visits. Administrators say the change is designed to reduce wait times and make care more accessible for patients with limited daytime availability.',
  },
  {
    id: 'festival-preview',
    imageUrl: 'https://picsum.photos/seed/news-festival-preview/720/448',
    title: 'Annual Arts Festival Reveals Lineup',
    headline: 'Organizers shared this year’s headline performances and public exhibits.',
    content:
      'Festival organizers released a full schedule featuring local musicians, public art installations, and outdoor film screenings across five venues. This year introduces a neighborhood pass that bundles transit discounts with entry to selected evening events. City officials expect higher attendance and additional support for small businesses near the festival district.',
  },
]

export default function NewsFeed() {
  const [expandedIds, setExpandedIds] = useState(() => new Set())

  const toggleExpanded = (itemId) => {
    setExpandedIds((currentIds) => {
      const nextIds = new Set(currentIds)
      if (nextIds.has(itemId)) {
        nextIds.delete(itemId)
      } else {
        nextIds.add(itemId)
      }
      return nextIds
    })
  }

  return (
    <div className="max-w-5xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">News feed</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted">
        Five example news stories shown as expandable cards using mock content only.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {newsItems.map((item) => {
          const isExpanded = expandedIds.has(item.id)
          const contentId = `${item.id}-content`
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[10px] border border-border bg-surface"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="block h-48 w-full object-cover"
                width={720}
                height={448}
                loading="lazy"
              />
              <div className="flex flex-col gap-3 px-4 py-4">
                <h2 className="text-lg font-semibold text-fg">{item.title}</h2>
                <p className="m-0 text-sm leading-relaxed text-muted">{item.headline}</p>
                <button
                  type="button"
                  className={cn(
                    'w-fit cursor-pointer rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors',
                    'hover:border-accent-dim hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  )}
                  onClick={() => toggleExpanded(item.id)}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                >
                  {isExpanded ? 'Collapse' : 'Read more'}
                </button>
                {isExpanded ? (
                  <p id={contentId} className="m-0 border-t border-border pt-3 text-sm leading-relaxed text-fg">
                    {item.content}
                  </p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
