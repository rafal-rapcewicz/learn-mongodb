import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Cursor, MongoError } from 'mongodb';
import path from 'path';
import cors from 'cors';
import * as joi from 'joi';
import * as db from './db';

const collection = 'listingsAndReviews';
const app: Application = express();
const schema = joi.object().keys({
    name: joi.string().required(),
    notes: joi.string(),
    property_type: joi.string(),
    room_type: joi.string(),
    house_rules: joi.string()
});

app.use(
    bodyParser.json(),
    cors(),

    // in tutorial author added message and error to successful responses to use it for notifications..
    <ErrorRequestHandler>(error: any, request: Request, response: Response, next: NextFunction) => {
        response.status(error.status).json({
            error: {
                message: error.message
            }
        });
    }
);

app.get('/airbnb', (request: Request, response: Response) => {
    const database = db.getDB();
    const skip = parseInt(request.query.skip);

    if (database) {
        const cursor: Cursor<any> = database
            .collection(collection)
            .find({});

        Promise.all([
            cursor
                .skip(skip)
                .limit(10)
                .toArray(),
            cursor
                .count()
        ]).then(([data, total]) => {
            response.json({
                data,
                total
            })
        },
            error => {
                console.log(error);
            });

        // database
        //     .collection(collection)
        //     .find({})
        //     .skip(skip)
        //     .limit(10)
        //     .toArray((error: MongoError, result: any[]) => {
        //         if (error) {
        //             console.log(error);
        //             return;
        //         }

        //         console.log(result);
        //         response.json(result);
        //     });
    }
});

app.get('/:id', (request: Request, response: Response) => {
    const id = request.params.id;
    const database = db.getDB();

    if (database) {
        database.collection(collection)
            .findOne(
                { _id: id /*db.getPrimaryKey(id)*/ },
                (error, result) => {
                    if (error) {
                        console.log(error); // notify user instead
                        return;
                    }

                    response.json(result);
                }
            )
    }
});

// update
app.put('/:id', (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const properties = request.body;
    const database = db.getDB();
    const handleError = (message: string, status: number, next: NextFunction) => {
        const _error = new Error(message);
        (<any>_error).status = status;
        next(_error);
    }

    if (database) {

        // exmple of validation
        joi.validate(properties, schema, (error: joi.ValidationError, result) => {
            if (error) {
                handleError('Invalid input', 500, next);
                return;
            }

            database.collection(collection)
                .findOneAndUpdate(
                    { _id: id /*db.getPrimaryKey(id)*/ },
                    { $set: properties },
                    { returnOriginal: false },
                    (error, result) => {
                        if (error) {
                            handleError('Failed to update', 500, next);
                            return;
                        }

                        response.json(result);
                    }
                );
        });
    }
});

// insert
app.post('/', (request: Request, response: Response) => {
    const airbnb = request.body;
    const database = db.getDB();

    if (database) {
        database.collection(collection)
            .insertOne(
                airbnb,
                (error, result) => {
                    if (error) {
                        console.log(error); // notify user instead
                        return;
                    }

                    response.json({
                        result,
                        document: result.ops[0]
                    });
                }
            );
    }
});

app.delete('/:id', (request: Request, response: Response) => {
    const id = request.params.id;
    const database = db.getDB();

    if (database) {
        database.collection(collection).findOneAndDelete(
            { _id: db.getPrimaryKey(id) },
            (error, result) => {
                if (error) {
                    console.log(error); // notify user instead
                    return;
                }

                response.json(result);
            }
        );
    }
});

// Allowed extensions list can be extended depending on your own needs
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];


app.get('*' /* '/' */, (request: Request, response: Response) => {
    const clientPath = '../client/dist/learn-mongodb';

    if (allowedExt.filter(ext => request.url.indexOf(ext) > 0).length > 0) {
        response.sendFile(path.resolve(`${clientPath}/${request.url}`));
        return;
    }

    response.sendFile(path.resolve(`${clientPath}/index.html`));

    // response.sendFile(path.join(__dirname, 'index.html'));
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
