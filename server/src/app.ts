import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Cursor, MongoError } from 'mongodb';
import path from 'path';
import cors from 'cors';
import * as db from './db';

const collection = 'listingsAndReviews';
const app: Application = express();

app.use(
    bodyParser.json(),
    cors()
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
app.put('/:id', (request: Request, response: Response) => {
    const id = request.params.id;
    const properties = request.body;
    const database = db.getDB();

    if (database) {
        database.collection(collection)
            .findOneAndUpdate(
                { _id: id /*db.getPrimaryKey(id)*/ },
                { $set: properties },
                { returnOriginal: false },
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
