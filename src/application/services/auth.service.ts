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
        console.log("user", JSON.stringify(user));
        if (!user || !(await UserService.validateUserPassword(user, password))) {
            throw new Error('Invalid credentials');
        }
        return user;
    }

    /**
     * 
     * @param userId 
     * @param email 
     * @returns { accessToken, refreshToken }
     */
    public generateToken(userId: string, email: string): { accessToken: string, refreshToken: string } {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        const accessToken = jwt.sign({ id: userId, email: email }, jwtSecret, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: userId, email: email }, jwtSecret, { expiresIn: '7d' });
        const tokens = { accessToken, refreshToken };
        return tokens;
    }


    /**
     * 
     * @param userId 
     * @param email 
     * @returns accesToken: string
     */
    public generateAccessToken(userId: string, email: string): string {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        const accessToken = jwt.sign({ id: userId, email: email }, jwtSecret, { expiresIn: '1h' });
        return accessToken;
    }
}

export default AuthService.getInstance(); 