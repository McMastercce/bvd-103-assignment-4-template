import { z } from "zod";
import { book_collection } from "../database_access";
import { type Book } from "../adapter/assignment-2";
import { ZodRouter } from "koa-zod-router";

export default function books_list(router: ZodRouter) {

    router.register({
        name: "list books",
        method: "get",
        path: "/books",
        validate: {
            query: z.object({
                filters: z.object({
                    from: z.coerce.number().optional(),
                    to: z.coerce.number().optional()
                }).array().optional()
            })
        },
        handler: async (ctx, next) => {
            const { filters } = ctx.request.query;

            const query = filters && filters.length > 0 ? {
                $or: filters.map(({ from, to }) => {
                    const filter: { $gte?: number, $lte?: number } = {};
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
                    return { price: filter as { $gtr?: number, $lte?: number } }
                })
            } : {};

            const book_list = await book_collection.find(query).map(document => {
                let book: Book = {
                    id: document._id.toHexString(),
                    name: document.name,
                    image: document.image,
                    price: document.price,
                    author: document.author,
                    description: document.description
                };
                return book;
            }).toArray();

            ctx.body = book_list;
            await next();
        }
    });
}