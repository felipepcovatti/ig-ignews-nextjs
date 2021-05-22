import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')

jest.mock('../../services/prismic')

jest.mock('next/router')

const postContentText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

const post = {
  title: 'Lorem Ipsum',
  content: `<p>${postContentText}</p>`,
  slug: 'lorem-ipsum',
  updatedAt: '22 de maio de 2021'
}

const prismicGetByUIDResponse = {
  data: {
    title: [
      {
        type: 'heading',
        text: post.title
      }
    ],
    content: [
      {
        type: 'paragraph',
        text: postContentText
      }
    ]
  },
  last_publication_date: '05-22-2021'
}

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([null, false])

    render(<PostPreview post={post} />)

    expect(screen.getByText(postContentText)).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects to full post if with active subscription', async () => {
    const useSessionMock = mocked(useSession)

    useSessionMock.mockReturnValueOnce([{
      activeSubscription: {}
    } as any, false])

    const useRouterMock = mocked(useRouter)

    const pushMock = jest.fn()

    useRouterMock.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)
  })

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient)

    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(prismicGetByUIDResponse)
    } as any)

    const response = await getStaticProps({
      params: { slug: post.slug }
    })

    expect(response).toEqual(expect.objectContaining({
      props: {
        post
      }
    }))
  })
})