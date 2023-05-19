import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../../lib/serverAuth";
import prismadb from '../../../lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { profile } = req.query;

    if (typeof profile !== 'string') {
      throw new Error('Invalid Id');
    }

    if (!profile) {
      throw new Error('Missing Id');
    }

    const { currentUser } = await serverAuth(req);

    if (!currentUser) {
      return res.status(401).end();
    }

    const currentProfile = await prismadb.profile.findUnique({
      where: {
        id: profile,
      },
    });

    if (!currentProfile || currentProfile?.userId !== currentUser.id) {
      return res.status(401).end();
    }

    return res.status(200).json(currentProfile);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}