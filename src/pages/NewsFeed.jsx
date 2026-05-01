import { useState } from 'react'

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
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Content</p>
          <h1 className="ds-page-title">News feed</h1>
          <p className="ds-page-lede">
            Five example news stories shown as expandable cards using mock content only. Secondary actions use the outlined
            primary button pattern from the design system.
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {newsItems.map((item) => {
          const isExpanded = expandedIds.has(item.id)
          const contentId = `${item.id}-content`
          return (
            <article key={item.id} className="ds-card-interactive flex flex-col ring-1 ring-primary/[0.04]">
              <div className="relative aspect-[720/448] overflow-hidden rounded-t-2xl bg-muted-bg">
                <img
                  src={item.imageUrl}
                  alt=""
                  className="block h-full w-full object-cover"
                  width={720}
                  height={448}
                  loading="lazy"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/70 via-secondary/15 to-transparent"
                  aria-hidden
                />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 px-4 pb-4 pt-14">
                  <p className="text-sm font-bold leading-snug text-on-primary drop-shadow-sm">{item.title}</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 border-t border-border px-5 py-5">
                <h2 className="text-lg font-bold tracking-tight text-fg">{item.title}</h2>
                <p className="m-0 text-sm leading-relaxed text-muted">{item.headline}</p>
                <button
                  type="button"
                  className="ds-btn-secondary mt-auto w-fit px-4 py-2.5 text-sm"
                  onClick={() => toggleExpanded(item.id)}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                >
                  {isExpanded ? 'Collapse article' : 'Read full article'}
                </button>
                {isExpanded ? (
                  <p id={contentId} className="m-0 border-t border-border pt-4 text-sm leading-relaxed text-fg">
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
