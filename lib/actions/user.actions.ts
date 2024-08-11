"use server";

import { CreateUserParams, UpdateUserParams } from "@/types";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";

import { revalidatePath } from "next/cache";

//create
export async function createUser(user: CreateUserParams) {
    try {
        await connectToDatabase();

        const newUser = await User.create(user);

        return JSON.parse(newUser);
    } catch(error) {
        handleError(error);
    } 
}

//read
export async function getUserById(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });

        if(!user) throw new Error("User not found");

        return JSON.parse(user);
    } catch(error) {
        handleError(error);
    }
}

//update
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });

        if (!updatedUser) throw new Error("User update failed");
        
        return JSON.parse(JSON.stringify(updatedUser));    
    } catch (error) {
        handleError(error);
    }
}

export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();

        const userToDelete = await User.findOne({ clerkId })

        if (!userToDelete) {
            throw new Error("User not found");
        }

        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");

        return deletedUser ? JSON.parse(deletedUser) : null;    
    } catch (error) {
        handleError(error)
    }
}