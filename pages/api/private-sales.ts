import type { NextApiRequest, NextApiResponse } from 'next'
import {WORDPRESS_API_ENDPOINT} from "../../src/utils/endpoints";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {

	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' })
	}

	const { password } = JSON.parse(req.body)

	const check = await fetch(`${ WORDPRESS_API_ENDPOINT}/wp/v2/pages/3909?password=${password}`).then(response => response.json())

	console.log(req.body.password, check)

	if (check.code === 'rest_post_incorrect_password') {
		return res.status(401).json({
			authenticated: false,
		})
	}

	return res.status(200).json({
		authenticated: true,
	})

}