import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// middleware
export const verify = (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('auth-token');

    if (!token) {
        return response.status(401).send('Access denied!');
    }

    try {
        const verified = jwt.verify(token, <string>process.env.TOKEN_SECTET);

        // TODO: extend Request interface
        (<any>request).user = verified;

        next();
    } catch (error) {
        response.status(400).send('Invalid token');
    }
};
