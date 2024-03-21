import Koa from "koa";
import cors from "@koa/cors";
import zodRouter from 'koa-zod-router';
import qs from "koa-qs";
import books_list from "./books/list";
import create_or_update_book from "./books/create_or_update";
import delete_book from "./books/delete";

const app = new Koa();

// We use koa-qs to enable parsing complex query strings, like our filters.
qs(app);

// And we add cors to ensure we can access our API from the mcmasterful-books website
app.use(cors())


const router = zodRouter();

// Setup Book List Route
books_list(router);

// Setup Book Create Route
create_or_update_book(router);

// Setup Book Delete Route
delete_book(router);


app.use(router.routes());

app.listen(3000, () => {
    console.log("listening!")
});