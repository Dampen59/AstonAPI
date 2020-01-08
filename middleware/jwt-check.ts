import { Request, Response, NextFunction } from "express";
import { verify, VerifyOptions } from "jsonwebtoken";
import * as httpContext from 'express-http-context';
import { getRepository } from "typeorm";
import { User } from "../src/entity/User";

export const JWT_SIGN_KEY = "gVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z%C&F)J@NcRfUjXn2r5u8x/A?D(G-Ka";

export async function jwtCheck(request: Request, response: Response, next: NextFunction) {
    const auth = request.header('Authorization');

    if (!auth) {
        response.status(401);
        return { error: 'Unauthorized', code: 401 };
    }

    const token: string = auth.replace('Bearer ', '');
    const options: VerifyOptions = { algorithms: ["HS256"], maxAge: "5m" };

    try {

        let payload: any = verify(token, JWT_SIGN_KEY, options);

        if (!payload) {
            response.status(401);
            return { error: 'Unauthorized', code: 401 };
        }

        const repo = getRepository(User);
        const user = await repo.findOne(payload.id);

        httpContext.set('user', user);

        next();

    } catch (error) {
        response.status(422).json(error);
    }

}