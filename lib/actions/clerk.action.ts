// app/actions/customer.actions.ts
'use server'

import { connectToDatabase } from "@/lib/mongoose"
import Customer from "@/database/customer.model"
import Staff from "@/database/staff.model"
import { revalidatePath } from "next/cache"

interface ClerkUser {
    id: string;
    firstName: string;
    lastName: string;
    emailAddresses: Array<{
        emailAddress: string;
    }>;
    phoneNumbers: Array<{
        phoneNumber: string;
    }>;
}

export async function createOrGetCustomer(clerkData: ClerkUser) {
    try {
        await connectToDatabase();

        const existingCustomer = await Customer.findOne({
            clerkId: clerkData.id
        });

        if (existingCustomer) {
            return {
                success: true,
                message: "Customer found",
                data: existingCustomer
            };
        }

        const newCustomer = await Customer.create({
            clerkId: clerkData.id,
            fullName: `${clerkData.firstName} ${clerkData.lastName}`,
            email: clerkData.emailAddresses[0]?.emailAddress || "",
            phoneNumber: clerkData.phoneNumbers[0]?.phoneNumber || "",
            address: "", // Có thể cập nhật sau
            createdAt: new Date(),
            updatedAt: new Date(),
            point: 0,
            orders: []
        });

        revalidatePath("/"); // Revalidate cache

        return {
            success: true,
            message: "Customer created successfully",
            data: newCustomer
        };

    } catch (error) {
        console.error("Error in createOrGetCustomer:", error);
        return {
            success: false,
            message: "Failed to process customer",
            error: (error as Error).message
        };
    }
}


export type UserRole = "customer" | "staff" | "admin" | null;

interface RoleCheckResult {
    success: boolean;
    role: UserRole;
    userId?: string;
    message: string;
    error?: string;
}

export async function checkUserRole(clerkId: string): Promise<RoleCheckResult> {
    try {
        await connectToDatabase();

        // Kiểm tra trong collection Customer
        const customer = await Customer.findOne({ clerkId }).select('_id');
        if (customer) {
            return {
                success: true,
                role: "customer",
                userId: customer._id.toString(),
                message: "User is a customer"
            };
        }

        // Kiểm tra trong collection Staff
        const staff = await Staff.findOne({ clerkId }).select('_id');
        if (staff) {
            return {
                success: true,
                role: "staff",
                userId: staff._id.toString(),
                message: "User is a staff member"
            };
        }

        // Kiểm tra trong collection Admin
        if (clerkId === process.env.ADMIN_CLERK_ID) {
            return {
                success: true,
                role: "admin",
                userId: process.env.ADMIN_CLERK_ID,
                message: "User is an admin"
            };
        }

        // Không tìm thấy user trong bất kỳ collection nào
        return {
            success: false,
            role: null,
            message: "User not found in any role"
        };

    } catch (error) {
        console.error("Error in checkUserRole:", error);
        return {
            success: false,
            role: null,
            message: "Error checking user role",
            error: (error as Error).message
        };
    }
}