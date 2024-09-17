import React, { useCallback, useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { type Airport } from '../services/airports.service'

import debounce from 'just-debounce-it'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { ScrollArea } from '@/ui/scroll-area'
import { Loader2, Plane } from 'lucide-react'

interface SearchableDropdownProps {
  fetchDestinations: (query: string) => Promise<Airport[]>;
  placeholder?: string;
  id?: string;
  label?: string;
  onSelect?: (selectedDestination: Airport) => void;
}

export const SearchableDropdown = forwardRef((props: SearchableDropdownProps, ref) => {
  const { fetchDestinations, placeholder, onSelect, id, label } = props;

  const [search, setSearch] = useState('')
  const [destinations, setDestinations] = useState<Airport[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  useImperativeHandle(ref, () => ({
    getDestinations: () => destinations,
  }));

  const debouncedFetchDestinations = useCallback(
    debounce(async (query: string) => {
      setIsLoading(true)
      try {
        const data = await fetchDestinations(query)
        setDestinations(data)
      } catch (error) {
        console.error('Error fetching destinations:', error)
        setDestinations([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [fetchDestinations]
  )

  useEffect(() => {
    if (search.length > 3 && destinations.length === 0) {
      debouncedFetchDestinations(search)
    } else {
      setDestinations([])
    }
  }, [search, debouncedFetchDestinations])

  const filteredDestinations = destinations.filter(dest =>
    dest.city.toLowerCase().includes(search.toLowerCase()),
  )

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.classList.contains('dropdown-option')) {
        setIsOpen(false)
      }
    }, 100)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex(prevIndex =>
        prevIndex < filteredDestinations.length - 1 ? prevIndex + 1 : prevIndex,
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0))
    } else if (event.key === 'Enter' && selectedIndex >= 0) {
      handleOptionClick(selectedIndex)
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && optionRefs.current[selectedIndex]) {
      optionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      })
    }
  }, [selectedIndex])

  const handleOptionClick = (index: number) => {
    const selectedDestination = filteredDestinations[index]
    setSearch(selectedDestination.name)
    setIsOpen(false)
    setSelectedIndex(index)
    if (onSelect) {
      onSelect(selectedDestination)
    }
  }

  return (
    <div className='relative w-full max-w-sm mx-auto'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Input
          id={id}
          type='text'
          placeholder={placeholder}
          required
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className='w-full pl-3 pr-10 py-2 border-2 rounded-lg'
        />
        {isLoading && <Loader2 className='absolute my-auto inset-y-0 right-0 mr-4 animate-spin' />}
      </div>

      {isOpen && filteredDestinations.length > 0 && (
        <div className='absolute top-full left-0 w-full max-h-60 overflow-y-auto z-10 mt-1 border rounded-md shadow-lg bg-background'>
          <ScrollArea className='h-full'>
            {filteredDestinations.map((dest, index) => (
              <Button
                ref={el => (optionRefs.current[index] = el)}
                variant='ghost'
                key={index}
                className={`w-full justify-start text-left px-4 py-2 ${selectedIndex === index ? 'bg-accent' : ''} dropdown-option`}
                onClick={() => handleOptionClick(index)}
              >
                <div className='ml-2 flex items-center gap-2'>
                  <Plane className='size-4'/>
                  <strong className='font-semibold text-sm'>{dest.city}</strong>
                  <small className='font-small text-xs'>{dest.name}</small>
                </div>
              </Button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  )
})
