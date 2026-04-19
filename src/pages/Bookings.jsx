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

export default function Bookings() {
  return (
    <div className="page bookings-page">
      <h1>Bookings</h1>
      <p className="page-lead">
        Example reservations with stay length counted as <strong>nights</strong> (each night is the period
        between check-in day and the morning of the following day; the check-out date is the departure
        morning).
      </p>
      <div className="bookings-table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th scope="col">Guest name</th>
              <th scope="col">Date range</th>
              <th scope="col">Apartment</th>
              <th scope="col">Nights</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={`${b.guestName}-${b.checkIn.toISOString()}`}>
                <td>{b.guestName}</td>
                <td>{formatDateRange(b.checkIn, b.checkOut)}</td>
                <td>{b.apartmentName}</td>
                <td>{b.nights}</td>
                <td>{currency.format(b.priceUsd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
