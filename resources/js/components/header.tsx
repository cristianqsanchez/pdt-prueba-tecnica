import { Link } from 'wouter'
import { ModeToggle } from '../ui/mode-toggle'

export function Header() {
  return (
    <header className='my-4 h-12 flex items-center justify-between'>
      <Link to='/' className='text-xl font-bold'>Flights App</Link>
      <ModeToggle />
    </header>
  )
}
