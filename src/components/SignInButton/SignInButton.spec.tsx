import { render, screen } from '@testing-library/react'
import { SignInButton } from '.'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'


jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('renders correctly when user is not authenticated', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([null, false])

    render(
      <SignInButton />
    )

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('renders correctly when user in authenticated', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          image: 'john_doe.png'
        },
        expires: 'fake-expires'
      },
      false
    ])

    render(
      <SignInButton />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})