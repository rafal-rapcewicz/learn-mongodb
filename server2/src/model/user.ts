import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    date: Date;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6, // characters
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model<IUser>('User', userSchema);
