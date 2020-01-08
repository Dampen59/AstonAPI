import * as bcryptjs from 'bcryptjs';
import { sign, SignOptions } from 'jsonwebtoken';
import { validate, Validator, ValidationError } from 'class-validator';
import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { Role } from '../entity/Role';

export class UserController {

    private userRepository = getRepository(User);
    private readonly JWT_SIGN_KEY = "gVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z%C&F)J@NcRfUjXn2r5u8x/A?D(G-Ka";

    async register(request: Request, response: Response) {
        const body = request.body as User;
        const user = new User();

        user.email = body.email;
        user.firstName = body.firstName;
        user.lastName = body.lastName;
        user.password = body.password;
        user.birthdate = new Date();

        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0) {
            response.status(400);
            return { error: 'Bad Request', code: 400 };
        }

        user.password = await bcryptjs.hashSync(user.password);

        const repoRole = getRepository(Role);
        const role = await repoRole.findOne({ where: { name: 'User' } });

        if (!role) {
            response.status(500);
            return { error: 'Internal Server Error', code: 500 };
        }

        user.roles = [role];

        try {
            response.status(201);
            await this.userRepository.save(user);
        } catch (error) {
            console.log(error);
            if (error.code === 'ER_DUP_ENTRY') {
                response.status(409);
                return { error: 'Conflict duplicate user', code: 409 };
            }
            console.log(error);
            response.status(422);
            return { error: 'UnprocessableEntity', code: 422 };
        }

        return user;
    }


    async authenticate(request: Request, response: Response) {
        const validator: Validator = new Validator();
        const email: string = request.body.email;
        const password: string = request.body.password;

        if (!validator.isEmail(email) || !validator.isNotEmpty(password)) {
            response.status(400);
            return { error: "Bad Request", code: 400 };
        }

        const user: User | undefined = await this.userRepository.findOne({ where: { email: email } });

        if (!user || await !bcryptjs.compareSync(password, user.password)) {
            response.status(401);
            return { error: "Unauthorized", code: 401 }
        }

        const options: SignOptions = { algorithm: 'HS256', expiresIn: 300 };
        const payload = { id: user.id, firstName: user.firstName, lastName: user.lastName };
        const token: string = sign(payload, this.JWT_SIGN_KEY, options);

        return { token_access: token };
    }

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}