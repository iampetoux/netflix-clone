import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../lib/prismadb";
import serverAuth from "../../lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req);

    try {
        const profiles = await prismadb.profile.findMany({
            where: {
                userId: currentUser?.id,
            }
        })

        return res.status(200).json(profiles);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}