import { ObjectId } from "mongodb";

export type CategorySchema = {
    userId?: ObjectId;
    name?: string;
    color?: string;
    createdAt?: Date;
    updatedAt?: Date;
}