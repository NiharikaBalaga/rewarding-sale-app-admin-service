import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { UserService } from './User';
import type { Response } from 'express';
import { httpCodes } from '../constants/http-status-code';


class TokenService {

    public static async getTokens(email: string) {
        const jwtAccessSecretKey: Secret = process.env.JWT_ACCESS_SECRET || '';
        const jwtRefreshSecretKey: Secret = process.env.JWT_REFRESH_SECRET || '';
        const [accessToken, refreshToken] = await Promise.all([jwt.sign({
            email: email
        }, jwtAccessSecretKey, {
            expiresIn: '30d',
        }), jwt.sign({
            email: email
        }, jwtRefreshSecretKey, {
            expiresIn: '150d',
        })]);
        return {
            accessToken,
            refreshToken
        };
    }
}


export {
    TokenService
};