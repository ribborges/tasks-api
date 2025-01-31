import { ObjectId } from "mongodb";

export type TaskStatus = "pending" | "completed" | "in-progress";

export type TaskSchema = {
    categoryId?: ObjectId;
    userId?: ObjectId;
    name?: string;
    description?: string;
    status?: TaskStatus;
    isImportant?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}