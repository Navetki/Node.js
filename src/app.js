const http = require("http");
const getUsers = require("./modules/users");

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
  const searchParams = parsedUrl.searchParams;

  if (searchParams.has("hello")) {
    const name = searchParams.get("hello");

    if (name && name.trim() !== "") {
      response.statusCode = 200;
      response.statusMessage = "OK";
      response.setHeader("Content-Type", "text/plain");
      response.write(`Hello, ${name} !`);
      return response.end();
    } else {
      response.statusCode = 400;
      response.statusMessage = "Bad Request";
      response.setHeader("Content-Type", "text/plain");
      response.write("Enter a name");
      return response.end();
    }
  }

  if (searchParams.has("users")) {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "application/json");
    response.write(getUsers());
    return response.end();
  }

  if (searchParams.toString() === "") {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "text/plain");
    response.write("Hello, world!");
    return response.end();
  }

  response.statusCode = 500;
  response.statusMessage = "Internal Server Error";
  response.setHeader("Content-Type", "text/plain");
  response.write("");
  return response.end();
});

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`Сервер запущен по адресу http://127.0.0.1:${PORT}`);
});
