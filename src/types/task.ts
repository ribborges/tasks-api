import { ObjectId } from "mongodb";

export type TaskSchema = {
    categoryId?: ObjectId;
    userId?: ObjectId;
    name?: string;
    description?: string;
    status?: "pending" | "completed" | "in-progress";
    isImportant?: boolean;
}