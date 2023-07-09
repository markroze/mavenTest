import express, { Application } from 'express';
export const app: Application = express();

// import prisma from './utils/prisma.utils';

const port = 3001;
const host = 'http://localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`\nServer listening on ${host}:${port}\n`);
});
