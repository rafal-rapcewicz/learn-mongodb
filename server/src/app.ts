import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { MongoError } from 'mongodb';
import path from 'path';
import cors from 'cors';
import * as db from './db';

const collection = 'listingsAndReviews';
const app: Application = express();

app.use(
    bodyParser.json(),
    cors()
);

app.get('/', (request: Request, response: Response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/airbnb', (request: Request, response: Response) => {
    const database = db.getDB();
    const skip = parseInt(request.query.skip);

    if (database) {
        database
            .collection(collection)
            .find({})
            .skip(skip)
            .limit(10)
            .toArray((error: MongoError, result: any[]) => {
                if (error) {
                    console.log(error);
                    return;
                }

                console.log(result);
                response.json(result);
            });
    }
});

db.connect((error: MongoError) => {
    if (error) {
        console.log('unable to connect to database');
        process.exit(1);
        return;
    }

    app.listen(3000, () => {
        console.log('connected to database, app listening on oprt 3000');
    });
});
