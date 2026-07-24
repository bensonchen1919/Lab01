import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));

app.use('/', pagesRouter);
app.use("/api", apiRouter);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).render("index", { title: "Home" });
});

app.get('/repeat/:word', (req, res) => {
  res.send("Gutenhag, web!\n".repeat(3));
});

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.get('/count', (req, res) => {
  const from = req.query.from ?? 1;
  const to = req.query.to ?? 10;

  res.send(`Counting from ${from} to ${to}`);
});

app.get('/api/info', (req, res) => {
  res.json({
  firstName: "Jane",
  lastName: "Doe"
  });
});

app.get('/api/error', (req, res) => {
  res.status(400).send("Bad request");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/entries", async (req, res) => {
  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);

  res
.status(200)
.set("Cache-Control", "public, max-age=60")
.set("X-total-count", entries.length.toString())
  .render("entries", {
    title: "Entries",
    entries
  });
});

app.get("/entries/:id", async (req, res) => {
  const id = Number(req.params.id);


  const data = await readFile("entries.json", "utf-8");
  const entries = JSON.parse(data);

  const entry = entries[id];

  if (!entry) {
    return res.status(404).send("Entry not found.");
  }

  res.status(200).render("entries", {
    title: entry.title,
    entries: [entry]
  });
});

app.post('/entries', async (req, res) => {
  const { title, body } = req.body;

  const data = await readFile('entries.json', 'utf-8');
  const entries = JSON.parse(data);

  const newEntry = {
    title,
    body
  };

  entries.push(newEntry);

  await writeFile(
    'entries.json',
    JSON.stringify(entries, null, 2)
  );

  res.status(201).json(newEntry);
});

app.delete('/entries/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await readFile('entries.json', 'utf-8');
  const entries = JSON.parse(data);

  if (id < 0 || id >= entries.length) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  entries.splice(id, 1);

  await writeFile(
    'entries.json',
    JSON.stringify(entries, null, 2)
  );

  res.status(204).send();
});

app.get('/three-posts', async (req, res) => {
  const ids = [1, 2, 3];
  const titles = [];
  for (const id of ids) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const post = await response.json();
    titles.push(post.title);
  }
  res.status(200).json({ titles });
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// work in progress
