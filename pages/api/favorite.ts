import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '../../lib/prismadb';
import serverAuth from "../../lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { movieId, profileId } = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            const profile = await prismadb.profile.update({
                where: {
                    id: profileId || '',
                },
                data: {
                    favoriteIds: {
                        push: movieId
                    }
                }
            });

            return res.status(200).json(profile);
        }

        if (req.method === 'DELETE') {
            const { currentUser } = await serverAuth(req);

            const { movieId, profileId } = req.body;

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                },
            });

            const profile = await prismadb.profile.findUnique({
                where: {
                    id: profileId,
                },
            });

            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            const updatedFavoriteIds = without(profile?.favoriteIds, movieId);

            const updatedProfile = await prismadb.profile.update({
                where: {
                    id: profileId || '',
                },
                data: {
                    favoriteIds: updatedFavoriteIds,
                },
            });

            return res.status(200).json(updatedProfile);
        }

        return res.status(405).end();
    } catch (error) {
        console.log(error);

        return res.status(500).end();
    }
}