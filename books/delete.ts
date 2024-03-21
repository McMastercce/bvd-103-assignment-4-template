import { type Express } from "express";
import { z } from "zod";
import { processRequest } from "zod-express-middleware";
import { ObjectId } from "mongodb";
import { book_collection } from "../database_access";

export default function delete_book(app: Express) {
    app.delete("/books/:id",
        // We are using zod and zod-express-middleware to validate that our query string is correct, and if not
        // it will reject the request.
        processRequest({
            params: z.object({
                id: z.string()
            })
        }), async (req, res) => {
            let id = req.params.id;
            let objectId = ObjectId.createFromHexString(id);
            const result = await book_collection.deleteOne({_id: {$eq: objectId}});
            if (result.deletedCount == 1) {
                res.json({});
            } else {
                res.statusCode = 404;
            }
            return;
        });
}