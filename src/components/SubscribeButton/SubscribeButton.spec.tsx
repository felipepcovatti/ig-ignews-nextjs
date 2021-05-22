import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'

jest.mock('next-auth/client')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([null, false])

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
  })

  it('redirects to sign in when not authenticated', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([null, false])

    const signInMock = mocked(signIn)

    render(
      <SubscribeButton />
    )

    fireEvent.click(screen.getByText('Subscribe Now'))

    expect(signInMock).toHaveBeenCalled()
  })

  it('redirects to posts when authenticated', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          image: 'john_doe.png'
        },
        expires: 'fake-expires',
        activeSubscription: {}
      },
      false
    ])

    const useRouterMock = mocked(useRouter)
    const pushMock = jest.fn()

    useRouterMock.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <SubscribeButton />
    )

    fireEvent.click(screen.getByText('Subscribe Now'))

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})