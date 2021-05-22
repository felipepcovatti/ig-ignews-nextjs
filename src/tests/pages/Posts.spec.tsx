import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const post = {
  title: 'Lorem Ipsum',
  excerpt: 'Lorem ipsum dolor sit amet',
  slug: 'lorem-ipsum',
  updatedAt: '22 de maio de 2021'
}

const prismicQueryResults = [{
  uid: post.slug,
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
        text: post.excerpt
      }
    ]
  },
  last_publication_date: '05-22-2021'
}]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={[post]} />)

    expect(screen.getByText(post.title)).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMock = mocked(getPrismicClient)
    getPrismicClientMock.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: prismicQueryResults
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [post]
        }
      })
    )
  })
})