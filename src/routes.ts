import { UserController } from "./controller/UserController";
import { DefaultController } from "./controller/DefaultController";
import { User } from "./entity/User";

export const Routes = [

    {
        method: 'post',
        route: '/user/register',
        controller: UserController,
        action: 'register'
    },

    {
        method: 'post',
        route: '/user/authenticate',
        controller: UserController,
        action: 'authenticate'
    },

    {
        method: 'get',
        route: '/',
        controller: DefaultController,
        action: "hello"
    },

    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    },

    {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    },

    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    },

    {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    }

];