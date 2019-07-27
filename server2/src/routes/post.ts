import { Request, Response, Router } from 'express';

import { verify } from './verifyToken';

export const router = Router();

router.get('/', verify, (request: Request, response: Response) => {
    response.send((<any>request).user);

    // response.json({
    //     title: 'my first post',
    //     description: 'random data you shouldnt access'
    // })
});
