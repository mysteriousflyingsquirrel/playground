const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Nights between check-in and check-out (check-out morning is not counted as a stayed night). */
function nightsBetween(checkIn, checkOut) {
  const msPerDay = 86_400_000
  return Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay)
}

function formatDateRange(checkIn, checkOut) {
  return `${dateFormat.format(checkIn)} – ${dateFormat.format(checkOut)}`
}

const bookings = [
  {
    guestName: 'Alex Rivera',
    checkIn: new Date(2025, 2, 14),
    checkOut: new Date(2025, 2, 18),
    apartmentName: 'Harbor Loft',
    priceUsd: 892,
  },
  {
    guestName: 'Jordan Kim',
    checkIn: new Date(2025, 4, 2),
    checkOut: new Date(2025, 4, 9),
    apartmentName: 'Garden Studio',
    priceUsd: 1410,
  },
  {
    guestName: 'Sam Patel',
    checkIn: new Date(2025, 5, 20),
    checkOut: new Date(2025, 5, 23),
    apartmentName: 'Skyline One-Bedroom',
    priceUsd: 678,
  },
  {
    guestName: 'Taylor Nguyen',
    checkIn: new Date(2025, 7, 1),
    checkOut: new Date(2025, 7, 7),
    apartmentName: 'Harbor Loft',
    priceUsd: 1320,
  },
  {
    guestName: 'Riley Brooks',
    checkIn: new Date(2025, 10, 22),
    checkOut: new Date(2025, 10, 27),
    apartmentName: 'Garden Studio',
    priceUsd: 995,
  },
].map((row) => ({
  ...row,
  nights: nightsBetween(row.checkIn, row.checkOut),
}))

const cell = 'border-b border-border px-3.5 py-2.5 text-left align-top text-[0.9375rem] text-fg'
const thCell =
  'border-b border-border bg-accent/10 px-3.5 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted'

export default function Bookings() {
  return (
    <div className="max-w-6xl">
      <h1 className="mb-3 text-[1.75rem] font-semibold">Bookings</h1>
      <p className="mb-6 text-[1.05rem] leading-normal text-muted [&_strong]:text-fg">
        Example reservations with stay length counted as <strong>nights</strong> (each night is
        the period between check-in day and the morning of the following day; the check-out date is
        the departure morning).
      </p>
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="min-w-[36rem] w-full border-collapse overflow-hidden rounded-[10px] border border-border bg-surface text-[0.9375rem]">
          <thead>
            <tr>
              <th scope="col" className={thCell}>
                Guest name
              </th>
              <th scope="col" className={thCell}>
                Date range
              </th>
              <th scope="col" className={thCell}>
                Apartment
              </th>
              <th scope="col" className={`${thCell} whitespace-nowrap tabular-nums`}>
                Nights
              </th>
              <th scope="col" className={`${thCell} whitespace-nowrap tabular-nums`}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => {
              const last = i === bookings.length - 1
              const c = last ? `${cell} border-b-0` : cell
              const num = last ? `${cell} border-b-0 whitespace-nowrap tabular-nums` : `${cell} whitespace-nowrap tabular-nums`
              return (
                <tr key={`${b.guestName}-${b.checkIn.toISOString()}`}>
                  <td className={c}>{b.guestName}</td>
                  <td className={c}>{formatDateRange(b.checkIn, b.checkOut)}</td>
                  <td className={c}>{b.apartmentName}</td>
                  <td className={num}>{b.nights}</td>
                  <td className={num}>{currency.format(b.priceUsd)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
