import { AccessTokenSecret, AccessTokenExpiry } from './env.js'
import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
	const auth_header = req.get('authorization')
	if (!auth_header)
		return res.status(401).json({ error: 'Unauthorized' })
	if (!auth_header.startsWith('Bearer '))
		return res.status(401).json({ error: 'Authorization protocol is invalid' })

	const token = auth_header.slice('Bearer '.length)
	console.log(token)
	try {
		console.log("here")
		jwt.verify(token, AccessTokenSecret)
		console.log("here")
	} catch (err) {
		console.error(err)
		return res.status(401).json({ error: 'Invalid Access Token' })
	}
	console.log("here")
	next()
}

export function generateAccessToken(login) {
	const payload = { login }
	return jwt.sign(payload, AccessTokenSecret, { expiresIn: AccessTokenExpiry })
}
