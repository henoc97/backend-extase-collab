import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import UserModel, { IUser } from '../../domain/entities/user.entity';
import dotenv from 'dotenv';
import userService from '../services/user.service';

dotenv.config();

// Ensure that the JWT secret is defined
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Configuration de la stratégie JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret, // Now guaranteed to be a string
};

interface JwtPayload {
    id: string; // Adjust the type according to your user ID type
}

// Update VerifyCallback to accept IUser
type CustomVerifyCallback = (error: any, user?: IUser | false, info?: any) => void;

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload: JwtPayload, done: CustomVerifyCallback) => {
    try {
        const user = await userService.getUserById(jwtPayload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

// Ensure that the environment variables are defined
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
    throw new Error('Missing Google Client ID or Client Secret');
}

// Configuration de la stratégie Google
passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log('Google Profile:', profile);
        // console.log('Access Token:', accessToken);
        // console.log('Refresh Token:', refreshToken);

        // Vérifier si l'utilisateur existe déjà
        let _user = await userService.findOne({ googleId: profile.id });
        if (_user) {
            return done(null, _user);
        }

        // Créer un nouvel utilisateur
        let user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
        };
        const userCreated = await userService.createUser(user);
        return done(null, userCreated);
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id); // Utilisez l'ID de l'utilisateur pour la sérialisation
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id); // Utilisez votre modèle utilisateur ici
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport; 