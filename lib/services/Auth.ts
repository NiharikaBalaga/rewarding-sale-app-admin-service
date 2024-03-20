import AdminModel from "../DB/Models/Admin";
import {httpCodes} from "../constants/http-status-code";
import type { Response } from 'express';
import bcrypt from "bcrypt";
import {TokenService} from "./Token";

class AuthService {

    private static async _AdminExists(email: string) {
        const adminObject = await AdminModel.findOne({
            email
        });
        return {
            adminExists: adminObject ?  true : false,
            adminObject: adminObject,
        };
    }

    public static async verifyAdmin(email: string, password: string, res: Response) {
        try {
            console.log("verifyAdmin auth service");
            // Check if Admin exists
            const {adminExists, adminObject} = await this._AdminExists(email);
            console.log("adminExists: ", adminExists);
            console.log("adminObject: ", adminObject);
            if (!adminExists)
                return res.status(httpCodes.notFound).send('Admin not found'); // TODO format error message

            // Check password matching
            const passwordMatch = await bcrypt.compare(password, adminObject?.password || '');
            console.log("passwordMatch: ", passwordMatch);
            if (!passwordMatch)
                return res.status(httpCodes.badRequest).send('The password is incorrect, please check.');

            //  Generate Auth tokens also refresh token
            if (adminObject) {
                const {accessToken, refreshToken} = await TokenService.getTokens(adminObject.email);
                console.log("accessToken: ", accessToken);
                console.log("refreshToken: ", refreshToken);
                return res.status(httpCodes.ok).send({
                    message: 'Admin Verified successfully',
                    accessToken,
                    refreshToken,
                });
            }
        } catch (verifyOTPError) {
            console.error('verifyAdminError', verifyOTPError);
            return res.status(httpCodes.serverError).send('Verification failed, please try later');
        }
    }
}


export {
    AuthService
};