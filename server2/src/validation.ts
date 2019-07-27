import Joi from '@hapi/joi';

// RAV: much better use this: https://www.npmjs.com/package/joigoose
// RAV: bad solution, better just export pure schemas from here

export const registerValidation = (data: any) => {
    const schema = {
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    };

    return Joi.validate(data, schema);
};

export const loginValidation = (data: any) => {
    const schema = {
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    };

    return Joi.validate(data, schema);
};
