import UserModel from './user.model';
import token from '../../utils/token';
import User from './user.interface';
import updateData from '../../utils/interfaces/updateData';
import bcrypt from 'bcrypt';

class UserService {
    private user = UserModel;
    public async register(
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.create({
                name,
                email,
                password,
                role,
            });
            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }
    public async login(
        email: string,
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error(
                    'Unable to find user or user with that email does not exist'
                );
            }
            if (await user.isValidPassword(password)) {
                return token.createToken(user);
            } else {
                throw new Error('Wrong credentials');
            }
        } catch {
            throw new Error('Unable to login user');
        }
    }
    public async delete(id: string): Promise<User | void> {
        try {
            const deletedUser = await this.user
                .findOneAndDelete({ _id: id })
                .select(['-password'])
                .exec();
            return deletedUser as User;
        } catch {
            throw new Error('Unable to delete user or user does not exist');
        }
    }
    public async update(data: updateData): Promise<User | void> {
        try {
            const currentUser = await this.user.findOne({ _id: data.id });

            if (!currentUser)
                throw new Error('Error occurred: Unable to find your profile');
            if (!(await currentUser.isValidPassword(data.old_password)))
                throw new Error('You entered invalid current password');

            // Hash password
            if (data.password) {
                const hash = await bcrypt.hash(data.password, 10);
                data.password = hash;
            }

            const updatedUser = await this.user
                .findOneAndUpdate(
                    { _id: data.id },
                    { ...data },
                    { new: true, runValidators: true }
                )
                .select(['-password'])
                .exec();

            return updatedUser as User;
        } catch (error: any) {
            throw new Error(
                error.message ||
                    'Unable to update user, please check again your given information.'
            );
        }
    }
}

export default UserService;
