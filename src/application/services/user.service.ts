import UserModel, { User } from "../../domain/entities/user.entity";
import { comparePassword, hashPassword } from '../helper/hash-compare-pwd';

class UserService {
    private static instance: UserService;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async createUser(userData: any): Promise<User> {
        const user = new UserModel(userData);
        if (user.password) user.password = await hashPassword(user.password);
        return await user.save();
    }

    public async getUserById(userId: string): Promise<User | null> {
        return await UserModel.findById(userId);
    }

    public async findOne(query: object): Promise<User | null> { // Ajout de la méthode findOne
        return await UserModel.findOne(query);
    }

    public async updateUser(userId: string, updateData: any): Promise<User | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    public async deleteUser(userId: string): Promise<User | null> {
        return await UserModel.findByIdAndDelete(userId);
    }

    public async findUserByEmail(email: string) {
        return await UserModel.findOne({ email });
    }



    public async validateUserPassword(user: any, password: string): Promise<boolean> {
        return user?.password ? await comparePassword(user.password, password) : false;
    }


}

export default UserService.getInstance();
