import { type Express } from "express";
import { z } from "zod";
import { processRequest } from "zod-express-middleware";
import { book_collection } from "../database_access";
import { type Book } from "../adapter/assignment-2";

export default function books_list(app: Express) {
    app.get("/books",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        processRequest({
            query: z.object({
                filters: z.object({
                    from: z.coerce.number().optional(),
                    to: z.coerce.number().optional()
                }).array().optional()
            })
        }), async (req, res) => {
            let filters = req.query['filters'] || [];

            const query = {
                $or: filters.map(({from, to}) => {
                    const filter : { $gte?: number, $lte?: number }= {};
                    let valid = false;
                    if (from) {
                        valid = true;
                        filter.$gte = from;
                    }
                    if (to) {
                        valid = true;
                        filter.$lte = to;
                    }
                    return valid ? filter : false;
                }).filter(value => value !== false).map((filter) => {
                    return { price: filter as {$gtr?: number, $lte?: number }}
                })
            };
            
            const book_list = await book_collection.find(query.$or.length > 0 ? query : {}).map(document => {
                let book : Book = {
                    id: document._id.toHexString(),
                    name: document.name,
                    image: document.image,
                    price: document.price,
                    author: document.author,
                    description: document.description
                };
                return book;
            }).toArray();
            res.json(book_list);
            return;
        });
}