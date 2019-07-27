import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../model/user';
import { loginValidation, registerValidation } from '../validation';

export const router = Router();

router.post('/register', async (request: Request, response: Response) => {

    // validation
    const { error } = registerValidation(request.body);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    // checking if the user is already in the databse
    const emailExist = await User.findOne({ email: request.body.email });
    if (emailExist) {
        return response.status(400).send('Email already exists');
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    // create a new user
    const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        response.send({ user: savedUser._id });
    } catch (error) {
        response.status(400).send(error);
    }
});

router.post('/login', async (request: Request, response: Response) => {

    // validation
    const { error } = loginValidation(request.body);

    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    // checking if the email exists
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
        return response.status(400).send('Email is not valid');
    }

    // checking if the pssword is ok
    const validPass = await bcrypt.compare(request.body.password, user.password);

    if (!validPass) {
        return response.status(400).send('Not valid password');
    }

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, <string>process.env.TOKEN_SECTET);

    response.header('auth-token', token).send(token);//.send('Logged in!');
});
