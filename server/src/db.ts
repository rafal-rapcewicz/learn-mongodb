import { Db, MongoClient, MongoClientOptions, ObjectID } from 'mongodb';

const dbName = 'sample_airbnb'; // cluster: 'crud-mongodb'
const url = 'mongodb+srv://admin:monopass@crud-mongodb-2cngh.mongodb.net/test?retryWrites=true&w=majority';
const mongoOptions: MongoClientOptions = {
    useNewUrlParser: true
};
interface State {
    db: Db | null
}
const state: State = {
    db: null
};
const connect = (callback: Function) => {
    if (state.db) {
        callback();
        return;
    }

    MongoClient.connect(
        url,
        mongoOptions,
        (error, client) => {
            if (error) {
                callback(error);
                return;
            }

            state.db = client.db(dbName);
            callback();
        }
    )
};

const getPrimaryKey = (documentId: string) => new ObjectID(documentId);

const getDB = () => state.db;

export { getDB, connect, getPrimaryKey };
