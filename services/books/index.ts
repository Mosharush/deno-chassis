import { start, Context, router, Status } from "../../libs/webserver/mod.ts";
import Book from "./models/book.ts";

const baseRoute = "/books";

const books = new Map<Object, Book>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Author",
});

router.get(baseRoute, async (context: Context) => {
  context.response.body = Array.from(books.values());
});

router.get(`${baseRoute}/:id`, async (context) => {
  const id = context.params.id;
  if (!id) {
    context.response.status = Status.BadRequest;
    throw new Error("Bad Request");
  }

  const requestedBook = books.get(id);
  if (requestedBook) {
    context.response.body = requestedBook;
  } else {
    context.response.status = Status.NotFound;
    context.response.body = "404 Not Found";
  }
});

router.post(baseRoute, async (context: Context) => {
  if (!context.request.hasBody) {
    context.response.status = Status.BadRequest;
    throw new Error("Bad Request");
  }
  const body = await context.request.body();
  let book: Partial<Book> | undefined;
  if (body.type === "json") {
    book = body.value;
  } else if (body.type === "form") {
    book = {};
    for (const [key, value] of body.value) {
      book[key as keyof Book] = value;
    }
  }
  if (book) {
    context.assert(book.id && typeof book.id === "string", Status.BadRequest);
    books.set(book.id, book as Book);
    context.response.status = Status.OK;
    context.response.body = book;
    context.response.type = "json";
    return;
  }
  context.response.status = Status.BadRequest;
  throw new Error("Bad Request");
});

router.delete(baseRoute, (context) => {
  const id = context.params.id;
  if (!id) {
    context.response.status = Status.BadRequest;
    throw new Error("Bad Request");
  }

  const requestedBook = books.get(id);
  if (requestedBook) {
    books.delete(id);
    context.response.body = "Book deleted successfully!";
  } else {
    context.response.status = Status.NotFound;
    context.response.body = "404 Not Found";
  }
});
export const booksPut = router.put(baseRoute, (context: Context) => {});

await start();
