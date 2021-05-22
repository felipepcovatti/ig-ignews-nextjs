import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'

jest.mock('next/router')

jest.mock('next-auth/client', () => ({
  useSession() {
    return [
      null,
      false
    ]
  }
}))

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ amount: '$9.90' }} />)

    expect(screen.getByText('for $9.90 / month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retrieveMock = mocked(stripe.prices.retrieve)

    retrieveMock.mockResolvedValueOnce({ unit_amount: 990 } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            amount: '$9.90'
          }
        }
      })
    )
  })
})