export interface Book {
  name: string
  author: string
  description: string
  price: number
  image: string
};

async function listBooks (filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {
  // We want to generate the query string to match the format expected by qs: https://www.npmjs.com/package/qs
  const query = filters?.map(({ from, to }, index) => {
    let result = ''
    if (typeof from === 'number') {
      result += `&filters[${index}][from]=${from}`
    }
    if (typeof to === 'number') {
      result += `&filters[${index}][to]=${to}`
    }
    return result
  }).join('&') ?? ''

  // We then make the request
  const result = await fetch(`http://localhost:3000/books?${query}`)

  if (result.ok) {
    // And if it is valid, we parse the JSON result and return it.
    return await result.json() as Book[]
  } else {
    throw new Error('Failed to fetch books')
  }
}

const assignment = 'assignment-1'

export default {
  assignment,
  listBooks
}
