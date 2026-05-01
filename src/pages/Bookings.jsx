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
    checkIn: new Date(2026, 2, 14),
    checkOut: new Date(2026, 2, 18),
    apartmentName: 'Harbor Loft',
    priceUsd: 892,
  },
  {
    guestName: 'Jordan Kim',
    checkIn: new Date(2026, 4, 2),
    checkOut: new Date(2026, 4, 9),
    apartmentName: 'Garden Studio',
    priceUsd: 1410,
  },
  {
    guestName: 'Sam Patel',
    checkIn: new Date(2026, 5, 20),
    checkOut: new Date(2026, 5, 23),
    apartmentName: 'Skyline One-Bedroom',
    priceUsd: 678,
  },
  {
    guestName: 'Taylor Nguyen',
    checkIn: new Date(2026, 7, 1),
    checkOut: new Date(2026, 7, 7),
    apartmentName: 'Harbor Loft',
    priceUsd: 1320,
  },
  {
    guestName: 'Riley Brooks',
    checkIn: new Date(2026, 10, 22),
    checkOut: new Date(2026, 10, 27),
    apartmentName: 'Garden Studio',
    priceUsd: 995,
  },
].map((row) => ({
  ...row,
  nights: nightsBetween(row.checkIn, row.checkOut),
}))

export default function Bookings() {
  const totalNights = bookings.reduce((acc, b) => acc + b.nights, 0)
  const totalRevenue = bookings.reduce((acc, b) => acc + b.priceUsd, 0)

  return (
    <div className="ds-page">
      <header className="ds-page-header">
        <div className="ds-page-header-inner">
          <p className="ds-page-kicker">Operations</p>
          <h1 className="ds-page-title">Bookings</h1>
          <p className="ds-page-lede">
            Example reservations with stay length counted as <strong className="font-semibold text-fg">nights</strong> (each
            night is the period between check-in day and the morning of the following day; the check-out date is the departure
            morning).
          </p>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-3">
        <div className="ds-stat">
          <p className="ds-stat-value">{bookings.length}</p>
          <p className="ds-stat-label">Reservations shown</p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-value">{totalNights}</p>
          <p className="ds-stat-label">Total nights</p>
        </div>
        <div className="ds-stat">
          <p className="ds-stat-value tabular-nums">{currency.format(totalRevenue)}</p>
          <p className="ds-stat-label">Combined total</p>
        </div>
      </div>

      <div className="-mx-1 w-full min-w-0 overflow-x-auto px-1">
        <div className="ds-table-shell">
          <table className="ds-table min-w-[36rem]" aria-describedby="bookings-summary">
            <caption id="bookings-summary" className="sr-only">
              Sample reservations with guest, dates, apartment, nights, and price.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="ds-th">
                  Guest name
                </th>
                <th scope="col" className="ds-th">
                  Date range
                </th>
                <th scope="col" className="ds-th">
                  Apartment
                </th>
                <th scope="col" className="ds-th whitespace-nowrap tabular-nums">
                  Nights
                </th>
                <th scope="col" className="ds-th whitespace-nowrap tabular-nums">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => {
                const last = i === bookings.length - 1
                const baseTd = last ? 'ds-td border-b-0' : 'ds-td'
                const numTd = last
                  ? 'ds-td border-b-0 whitespace-nowrap tabular-nums'
                  : 'ds-td whitespace-nowrap tabular-nums'
                return (
                  <tr key={`${b.guestName}-${b.checkIn.toISOString()}`} className="hover:bg-muted-bg/60">
                    <td className={baseTd}>{b.guestName}</td>
                    <td className={baseTd}>{formatDateRange(b.checkIn, b.checkOut)}</td>
                    <td className={baseTd}>{b.apartmentName}</td>
                    <td className={numTd}>{b.nights}</td>
                    <td className={numTd}>{currency.format(b.priceUsd)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
