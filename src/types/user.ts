export type UserSchema = {
    username: string;
    name: string;
    email: string;
    auth: {
        password: string;
        salt: string;
        token?: string;
    };
    profilePic?: string;
    createdAt: Date;
    updatedAt?: Date;
}