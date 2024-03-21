export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    // We want to generate the query string to match the format expected by qs: https://www.npmjs.com/package/qs
    let query = filters?.map(({from, to}, index) => {
        let result = "";
        if (from) {
            result += `&filters[${index}][from]=${from}`;
        }
        if (to) {
            result += `&filters[${index}][to]=${to}`
        }
        return result;
    }).join("&") ?? "";

    // We then make the request
    let result = await fetch(`http://localhost:3000/books?${query}`);

    if (result.ok) {
        // And if it is valid, we parse the JSON result and return it.
        return await result.json() as Book[];
    } else {
        throw new Error("Failed to fetch books");
    }
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};