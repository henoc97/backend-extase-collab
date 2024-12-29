import UserModel, { IUser } from "../../domain/entities/user";

class UserService {
    private static instance: UserService;

    private constructor() { }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    public async createUser(userData: any): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    public async getUserById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId);
    }

    public async updateUser(userId: string, updateData: any): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    }

    public async deleteUser(userId: string): Promise<IUser | null> {
        return await UserModel.findByIdAndDelete(userId);
    }
}

export default UserService.getInstance();
