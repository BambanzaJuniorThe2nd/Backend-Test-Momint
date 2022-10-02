import { Request, Response, NextFunction } from 'express';
import { Container, User, AuthContext } from '../core';

export interface RestConfig {
    apiRoot: string;
}

export interface ApiRequest extends Request {
    core: Container;
    user: User;
    authContext: AuthContext;
}

export interface ApiResponse extends Response {

}

export interface ApiNextFunction extends NextFunction {

}