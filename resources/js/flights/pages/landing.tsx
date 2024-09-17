import { FlightBookingForm } from '../components/flight-booking-form'

export function Landing() {
  return (
    <main className='-mt-12 h-screen grid md:grid-cols-2 gap-8 place-content-center'>
      <section>
        <h1 className='mb-4 text-3xl font-medium text-balance'>Your next adventure starts here!</h1>
        <h2 className='text-6xl font-semibold flex md:flex-col gap-4'>
          <span>Search.</span>
          <span>Compare.</span>
          <span>Fly.</span>
        </h2>
      </section>

      <section>
        <FlightBookingForm />
      </section>
    </main>
  )
}
