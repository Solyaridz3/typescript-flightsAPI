import mongoose from 'mongoose';
import 'dotenv/config';
import config from './config';
import UserModel from './resources/user/user.model';
import User from './resources/user/user.interface';

(async function setup() {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI)
        throw new Error(
            'MONGO_URI is not defined. Check out your environment variables'
        );

    await mongoose.connect(MONGO_URI as string);
    console.log('connected to Mongo');
    const adminRole = 'admin';
    const promises = config.adminUsers.map(
        async (admin): Promise<User | void> => {
            try {
                await UserModel.deleteMany({});
                const { name, email, password } = admin;
                return await UserModel.create({
                    name,
                    email,
                    password,
                    role: adminRole,
                });
            } catch (error: any) {
                if (error.message.startsWith('E11000')) {
                    return console.log(
                        `User with email ${admin.email} already exists`
                    );
                }
                console.log(error.message);
            }
        }
    );
    await Promise.all(promises);
    console.log('Setup done');
})().then(() => process.exit(0));
