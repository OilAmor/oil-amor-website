import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../ui/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  
  it('is disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
  
  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })
  
  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="gold">Gold</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gold-pure')
    
    rerender(<Button variant="miron">Miron</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-miron-void')
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
