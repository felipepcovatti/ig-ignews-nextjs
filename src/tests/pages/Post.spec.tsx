import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next-auth/client')

jest.mock('../../services/prismic')

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

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText(postContentText)).toBeInTheDocument()
  })

  it('redirects to preview if without active subscription', async () => {
    const getSessionMock = mocked(getSession)

    getSessionMock.mockResolvedValueOnce({
      activeSubscription: null
    } as any)

    const response = await getServerSideProps({
      params: { slug: post.slug }
    } as any)

    expect(response).toEqual(expect.objectContaining({
      redirect: expect.objectContaining({
        destination: `/posts/preview/${post.slug}`
      })
    }))
  })

  it('loads initial data', async () => {
    const getSessionMock = mocked(getSession)

    getSessionMock.mockResolvedValueOnce({
      activeSubscription: {}
    } as any)

    const getPrismicClientMock = mocked(getPrismicClient)
    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(prismicGetByUIDResponse)
    } as any)

    const response = await getServerSideProps({
      params: { slug: post.slug }
    } as any)

    expect(response).toEqual(expect.objectContaining({
      props: {
        post
      }
    }))
  })
})