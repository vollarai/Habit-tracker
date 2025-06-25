require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 4000;
const SECRET = 'supersecretkey';

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword }
  });

  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ message: 'Invalid username or password' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid username or password' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/habits', authenticateToken, async (req, res) => {
  const habits = await prisma.habit.findMany({
    where: { userId: req.user.id }
  });
  res.json(habits);
});

app.post('/habits', authenticateToken, async (req, res) => {
  const { name } = req.body;

  const habit = await prisma.habit.create({
    data: {
      name,
      userId: req.user.id,
      history: []
    }
  });

  res.status(201).json(habit);
});

app.post('/habits/:id/mark', authenticateToken, async (req, res) => {
  const habit = await prisma.habit.findUnique({
    where: { id: req.params.id }
  });

  if (!habit || habit.userId !== req.user.id) return res.sendStatus(404);

  const history = habit.history || [];
  history.push(new Date().toISOString().split('T')[0]);

  const updated = await prisma.habit.update({
    where: { id: habit.id },
    data: { history }
  });

  res.json(updated);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
