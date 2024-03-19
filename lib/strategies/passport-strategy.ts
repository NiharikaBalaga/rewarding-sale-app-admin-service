import passportJWT from 'passport-jwt';
import passport from 'passport';
import  type{ Request } from 'express';


type JwtPayload = {
  email: string;
};
const JwtAccessStrategy  = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const jwtAccessSecret = process.env.JWT_ADMIN_SECRET || 'jlndoqwjwp9qjdlasjdnaajadgjasdgdsgdsh';
const jwtAccessSecretSuperAdmin = process.env.JWT_SUPER_ADMIN_SECRET || 'asdahsdasjdgasdgsadgashdgasjdambdkuqwhewuqeh';


passport.use('jwt-access-admin', new JwtAccessStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtAccessSecret,
  passReqToCallback: true,
}, (req: Request, jwtPayload: JwtPayload, done) => {
  const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();
  done(null, { ...jwtPayload, accessToken });
}));

passport.use('jwt-access-super-admin', new JwtAccessStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtAccessSecretSuperAdmin,
  passReqToCallback: true,
}, (req: Request, jwtPayload: JwtPayload, done) => {
  const accessToken = req.get('Authorization')?.replace('Bearer', '').trim();
  done(null, { ...jwtPayload, accessToken });
}));

export default passport;
