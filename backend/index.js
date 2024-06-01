const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3101;

app.use(express.json());

app.get("/", (req, res) => {
  const requestedPath = req.query.path || "/";
  const absolutePath = path.resolve(requestedPath);
  console.log(req.query);

  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      return res.status(404).send({ error: "Path not found" });
    }

    if (stats.isDirectory()) {
      fs.readdir(absolutePath, (err, files) => {
        if (err) {
          return res.status(500).send({ error: "Unable to read directory" });
        }

        const contents = files.map((file) => {
          const filePath = path.join(absolutePath, file);
          try {
            const fileStats = fs.statSync(filePath);
            return {
              name: file,
              isDirectory: fileStats.isDirectory(),
            };
          } catch (fileErr) {
            return {
              name: file,
              isDirectory: false,
              error: "Error accessing file",
            };
          }
        });

        res.send(contents);
      });
    } else {
      res.sendFile(absolutePath, (err) => {
        if (err) {
          res.status(500).send({ error: "Unable to send file" });
        }
      });
    }
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
