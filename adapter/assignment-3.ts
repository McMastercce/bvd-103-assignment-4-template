import previous_assignment from './assignment-2'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks (filters?: Filter[]): Promise<Book[]> {
  const query = filters?.map(({ from, to, name, author }, index) => {
    let result = ''
    if (typeof from === 'number') {
      result += `&filters[${index}][from]=${from}`
    }
    if (typeof to === 'number') {
      result += `&filters[${index}][to]=${to}`
    }
    if (typeof name === 'string' && name.trim().length > 0) {
      result += `&filters[${index}][name]=${name.trim()}`
    }
    if (typeof author === 'string' && author.trim().length > 0) {
      result += `&filters[${index}][author]=${author.trim()}`
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

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}
