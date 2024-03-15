import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';


class TokenService {
  public static async getAdminToken(userId: string, phoneNumber: string) {
    const jwtAccessSecretKey: Secret = process.env.JWT_ADMIN_SECRET || 'jlndoqwjwp9qjdlasjdnaajadgjasdgdsgdsh';
    const [accessToken] = await Promise.all([jwt.sign({
      userId, phoneNumber
    }, jwtAccessSecretKey, {
      expiresIn: '1d',
    })]);
    return {
      accessToken,
    };
  }

  public static async getSuperAdminToken(userId: string, phoneNumber: string) {
    const jwtAccessSecretKey: Secret = process.env.JWT_SUPER_ADMIN_SECRET || 'asdahsdasjdgasdgsadgashdgasjdambdkuqwhewuqeh';
    const [accessToken] = await Promise.all([jwt.sign({
      userId, phoneNumber
    }, jwtAccessSecretKey, {
      expiresIn: '1h',
    })]);
    return {
      accessToken,
    };
  }

}


export {
  TokenService
};