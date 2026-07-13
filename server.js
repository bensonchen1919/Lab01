import express from 'express';
import pagesRouter from './routes/pages.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', pagesRouter);
app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});