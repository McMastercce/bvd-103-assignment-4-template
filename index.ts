import express from "express";
import cors from "cors";
import books_list from "./books/list";
import create_or_update_book from "./books/create_or_update";
import delete_book from "./books/delete";

const app = express();

// Setting up to use express JSON for the body
app.use(express.json());
// And we add cors to ensure we can access our API from the mcmasterful-books website
app.use(cors());

// Setup Book List Route
books_list(app);

// Setup Book Create Route
create_or_update_book(app);

// Setup Book Delete Route
delete_book(app);

app.listen(3000, () => {
    console.log("listening!")
});