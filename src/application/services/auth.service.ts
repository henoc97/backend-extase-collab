import jwt from 'jsonwebtoken';
import UserService from './user.service';

class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    public async login(email: string, password: string) {
        const user = await UserService.findUserByEmail(email);
        if (!user || !(await UserService.validateUserPassword(user, password))) {
            throw new Error('Invalid credentials');
        }
        return user;
    }

    public generateToken(userId: string): string {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        return jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
    }
}

export default AuthService.getInstance(); 