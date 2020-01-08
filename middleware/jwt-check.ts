import { Request, Response, NextFunction } from "express";

export async function jwtCheck(request: Request, response: Response, next: NextFunction) {
    const auth = request.header('Authorization');

    if (!auth) {
        response.status(401);
        return { error: 'Unauthorized', code: 401 };
    }

    const token: string = auth.replace('Bearer ', '');

    console.log(token);

    next();

}