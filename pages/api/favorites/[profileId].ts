import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '../../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { profileId } = req.query;

    if (typeof profileId !== 'string') {
      throw new Error('Invalid Id');
    }

    if (!profileId) {
      throw new Error('Missing Id');
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        id: profileId!,
      },
    });

    const favoritedMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: profile?.favoriteIds,
        }
      }
    });

    return res.status(200).json(favoritedMovies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}