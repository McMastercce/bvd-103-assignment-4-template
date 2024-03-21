import assignment1 from "./assignment-1";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    let result = await fetch(`http://localhost:3000/books`, { method: "POST", body: JSON.stringify(book), headers: {
        "Content-Type": "application/json"
    } });

    if (result.ok) {
        let res = await result.json() as { id: BookID };
        return res.id;
    } else {
        throw new Error("Failed to create or update book");
    }
}

async function removeBook(book: BookID): Promise<void> {
    let result = await fetch(`http://localhost:3000/books/${book}`, { method: "DELETE"});

    if (!result.ok) {
        throw new Error("Failed to create or update book");
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};