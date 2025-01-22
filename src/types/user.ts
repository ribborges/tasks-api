export type UserSchema = {
    username?: string;
    name?: string;
    email?: string;
    auth?: AuthSchema;
    profilePic?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type AuthSchema = {
    password: string;
    salt: string;
}