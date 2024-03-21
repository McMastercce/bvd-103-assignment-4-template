import { type Express } from "express";
import { z } from "zod";
import { processRequest } from "zod-express-middleware";
import { book_collection } from "../database_access";
import { ObjectId } from "mongodb";

export default function create_or_update_book(app: Express) {
    app.post("/books",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        processRequest({
            body: z.object({
                id: z.string().optional(),
                name: z.string(),
                price: z.coerce.number(),
                description: z.string(),
                author: z.string(),
                image: z.string(),
            })
        }), async (req, res) => {
            let body = req.body;

            if (typeof body.id === "string") {
                let id = body.id;
                try {
                    const result = await book_collection.replaceOne({ _id: { $eq: ObjectId.createFromHexString(id) } }, {
                        id,
                        name: body.name,
                        description: body.description,
                        price: body.price,
                        author: body.author,
                        image: body.image
                    });
                    if (result.acknowledged && result.modifiedCount === 1) {
                        res.json({ id });
                    } else {
                        res.statusCode = 404;
                    }
                } catch (e) {
                    res.statusCode = 500;
                }
            } else {
                try {
                    const result = await book_collection.insertOne({
                        name: body.name,
                        description: body.description,
                        price: body.price,
                        author: body.author,
                        image: body.image
                    });
                    res.json({ id: result.insertedId });

                } catch (e) {
                    res.statusCode = 500;
                }
            }
        });
}