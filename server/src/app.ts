import express, { Application } from 'express';
export const app: Application = express();
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const port = 3001;
const host = 'http://localhost';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface UserGenderResData {
  count: number;
  name: string;
  gender: string;
  probability: number;
}

app.post('/login', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (user) {
      res.status(200).json({ user });
    } else {
      const userGenderRes = await axios.get(
        `https://api.genderize.io/?name=${username}`
      );
      const getUserGenderByProbability = (data: UserGenderResData) => {
        if (data.probability > 0.95) return data.gender;
        else return 'undetermined';
      };

      const userProfile = await axios.get(
        `https://randomuser.me/api/?gender=${userGenderRes.data.gender}`
      );

      const newUser = await prisma.user.create({
        data: {
          name: username,
          gender: userGenderRes.data.gender,
          profile: userProfile.data.results[0],
        },
      });

      res.status(200).json({ newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.post('/addResult', async (req, res) => {
  const { username, score } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (user) {
      const newResult = await prisma.gameResults.create({
        data: {
          score: parseFloat(score),
          userId: user.id,
        },
      });

      res.status(200).json({ newResult });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        gameResults: true,
      },
      orderBy: {
        gameResults: {
          _count: 'desc',
        },
      },
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`\nServer listening on ${host}:${port}\n`);
});
