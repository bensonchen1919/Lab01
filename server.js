import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;
const entries = [
  {
    id: 1,
    title: "First Entry",
    body: "This is the first blog entry."
  },
  {
    id: 2,
    title: "Second Entry",
    body: "This is the second blog entry."
  },
  {
    id: 3,
    title: "Third Entry",
    body: "This is the third blog entry."
  }
];
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use('/', pagesRouter);
app.use("/api", apiRouter);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Gutenhag, web!');
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

app.get("/entries", (req, res) => {
  res.render("entries", {
    title: "Entries",
    entries
  });
});

app.get("/entries/:id", (req, res) => {
  const id = Number(req.params.id);

  const entry = entries.find(entry => entry.id === id);

  if (!entry) {
    return res.status(404).send("Entry not found.");
  }

  res.render("entries", {
    title: entry.title,
    entries: [entry]
  });
});

app.post('/entries', (req, res) => {
  const { title, body } = req.body;
  const newEntry = {
    id: entries.length + 1,
    title,
    body
  };
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.delete('/entries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) {
  return res.status(404).json({ error: 'Entry not found' });
  }

  entries.splice(index, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// work in progress
