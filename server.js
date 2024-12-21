const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
};

const server = http.createServer((req, res) => {
  // Handle favicon.ico request
  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Get the file path
  let filePath = req.url === "/" ? "./index.html" : "." + req.url;

  // Get the file extension
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || "text/plain";

  // Read and serve the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404);
        res.end("File Not Found");
      } else {
        res.writeHead(500);
        res.end("Server Error: " + error.code);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(port, (error) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log(`Server is listening on http://localhost:${port}`);
  }
});
