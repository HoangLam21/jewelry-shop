// app/actions/customer.actions.ts
'use server'

import { connectToDatabase } from "@/lib/mongoose"
import Customer from "@/database/customer.model"
import Staff from "@/database/staff.model"
import { revalidatePath } from "next/cache"
import { clerkClient } from '@clerk/nextjs/server'

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

/**
 * Tạo invitation trên Clerk để gửi email mời đăng nhập
 * Sử dụng khi admin tạo staff mới - staff sẽ nhận email và tự set password
 */
export async function createClerkUser(data: {
  email: string;
  password?: string; // Optional - nếu có sẽ tạo user với password, nếu không sẽ gửi invitation
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}): Promise<{ success: boolean; userId?: string; message: string; error?: string }> {
  try {
    // Kiểm tra CLERK_SECRET_KEY có tồn tại không
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("[Clerk Create User] ❌ CLERK_SECRET_KEY is missing in environment variables");
      return {
        success: false,
        message: "Cấu hình Clerk chưa đầy đủ. Vui lòng kiểm tra CLERK_SECRET_KEY trong file .env",
        error: "CLERK_SECRET_KEY missing"
      };
    }

    const client = await clerkClient();
    
    // Validate email
    if (!data.email || !data.email.includes('@')) {
      return {
        success: false,
        message: "Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ email.",
        error: "Invalid email format"
      };
    }

    // Nếu có password, tạo user trực tiếp với password
    if (data.password) {
      const createUserParams: any = {
        emailAddress: [data.email],
        password: data.password,
      };

      if (data.firstName) {
        createUserParams.firstName = data.firstName;
      }
      if (data.lastName) {
        createUserParams.lastName = data.lastName;
      }

      console.log(`[Clerk Create User] Creating user with password:`, {
        email: createUserParams.emailAddress,
        firstName: createUserParams.firstName,
        lastName: createUserParams.lastName
      });

      const clerkUser = await client.users.createUser(createUserParams);
      console.log(`[Clerk Create User] User created successfully with ID: ${clerkUser.id}`);

      return {
        success: true,
        userId: clerkUser.id,
        message: "Clerk user created successfully with password"
      };
    }

    // Nếu không có password, tạo user với skipPasswordRequirement
    // Sau đó gửi invitation email để user tự set password
    console.log(`[Clerk Create User] Creating user without password (will send invitation):`, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    });
    const createUserParams: any = {
      emailAddress: [data.email],
      skipPasswordRequirement: true, // Bỏ qua yêu cầu password
    };

    if (data.firstName) {
      createUserParams.firstName = data.firstName;
    }
    if (data.lastName) {
      createUserParams.lastName = data.lastName;
    }

    console.log(`[Clerk Create User] Creating user without password (skipPasswordRequirement):`, {
      email: createUserParams.emailAddress,
      firstName: createUserParams.firstName,
      lastName: createUserParams.lastName
    });

    // Tạo user với retry logic để xử lý network errors
    let clerkUser;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        clerkUser = await client.users.createUser(createUserParams);
        console.log(`[Clerk Create User] User created successfully with ID: ${clerkUser.id}`);
        break;
      } catch (createError: any) {
        retryCount++;
        console.error(`[Clerk Create User] Attempt ${retryCount}/${maxRetries} failed:`, {
          error: createError?.message,
          code: createError?.code,
          status: createError?.status,
          errors: createError?.errors
        });
        
        if (retryCount >= maxRetries) {
          throw createError;
        }
        
        // Đợi một chút trước khi retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    // Kiểm tra xem clerkUser đã được tạo thành công chưa
    if (!clerkUser) {
      return {
        success: false,
        message: "Failed to create Clerk user after multiple retries.",
        error: "USER_CREATION_FAILED"
      };
    }

    // Sau khi tạo user thành công, gửi invitation để user set password
    try {
      const invitationParams: any = {
        emailAddress: data.email,
        notify: true,
      };

      // Thêm public metadata nếu có firstName/lastName
      if (data.firstName || data.lastName) {
        invitationParams.publicMetadata = {
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        };
      }

      await client.invitations.createInvitation(invitationParams);
      console.log(`[Clerk Create Invitation] Invitation sent to ${data.email}`);
    } catch (invitationError: any) {
      console.warn(`[Clerk Create Invitation] Could not send invitation:`, {
        error: invitationError?.message,
        code: invitationError?.code,
        status: invitationError?.status
      });
      // Không throw error vì user đã được tạo, chỉ cảnh báo
      // User có thể set password sau bằng cách request password reset
    }

    return {
      success: true,
      userId: clerkUser.id,
      message: "Clerk user created successfully. Invitation email sent to set password."
    };
  } catch (error: any) {
    console.error("Error creating Clerk user:", error);
    console.error("Error details:", {
      status: error?.status,
      errors: error?.errors,
      message: error?.message,
      clerkTraceId: error?.clerkTraceId,
      code: error?.code,
      cause: error?.cause
    });
    
    // Kiểm tra nếu là network error
    if (error?.message?.includes("fetch failed") || error?.code === "unexpected_error") {
      console.error("[Clerk Create User] Network error detected - possible causes:");
      console.error("1. CLERK_SECRET_KEY might be incorrect or missing");
      console.error("2. Network connectivity issue");
      console.error("3. Clerk API service might be temporarily unavailable");
      console.error("4. CSP or firewall blocking Clerk API calls");
      
      return {
        success: false,
        message: "Không thể kết nối đến Clerk API. Vui lòng kiểm tra kết nối mạng và cấu hình CLERK_SECRET_KEY.",
        error: `Network error: ${error?.message || "fetch failed"}`
      };
    }
    
    // Xử lý các lỗi phổ biến
    let errorMessage = "Không thể tạo tài khoản Clerk";
    
    if (error?.status === 400 || error?.status === 422 || error?.errors) {
      // Validation error từ Clerk - parse errors array
      const errors = error.errors || [];
      
      // Tìm lỗi liên quan đến email
      const emailError = errors.find((e: any) => 
        e?.message?.toLowerCase().includes('email') ||
        e?.code === 'form_identifier_exists' ||
        e?.code === 'form_identifier_invalid'
      );
      
      if (emailError) {
        if (emailError.code === 'form_identifier_exists') {
          errorMessage = "Email này đã được sử dụng. Vui lòng sử dụng email khác.";
        } else if (emailError.code === 'form_identifier_invalid') {
          errorMessage = "Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ email.";
        } else {
          errorMessage = emailError.longMessage || emailError.message || "Email không hợp lệ.";
        }
      } else {
        // Tìm lỗi phone number (nhưng không hiển thị vì đã bỏ phone number)
        const phoneError = errors.find((e: any) => 
          e?.code === 'form_param_unknown' && e?.message?.includes('phone')
        );
        
        if (phoneError) {
          // Bỏ qua lỗi phone number, chỉ log warning
          console.warn('[Clerk Create User] Phone number error (ignored):', phoneError.longMessage);
        }
        
        // Tìm lỗi password hoặc form_data_missing (thiếu password)
        const passwordError = errors.find((e: any) => 
          e?.message?.toLowerCase().includes('password') ||
          e?.code?.toLowerCase().includes('password') ||
          e?.code === 'form_data_missing'
        );
        
        if (passwordError) {
          if (passwordError.code === 'form_data_missing' && passwordError.longMessage?.includes('password')) {
            errorMessage = "Cấu hình Clerk yêu cầu password khi tạo user. Vui lòng liên hệ quản trị viên để cấu hình lại Clerk instance.";
          } else {
            errorMessage = passwordError.longMessage || passwordError.message || "Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất 8 ký tự.";
          }
        } else {
          // Lấy message từ error đầu tiên (bỏ qua phone number errors)
          const relevantErrors = errors.filter((e: any) => 
            !(e?.code === 'form_param_unknown' && e?.message?.includes('phone')) &&
            !(e?.code === 'unsupported_country_code')
          );
          
          if (relevantErrors.length > 0) {
            const firstError = relevantErrors[0];
            errorMessage = firstError.longMessage || firstError.message || `Lỗi: ${firstError.code || 'unknown'}`;
          } else {
            // Nếu chỉ có lỗi phone number, bỏ qua và tiếp tục
            errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.";
          }
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message || "Không thể tạo tài khoản Clerk";
    }
    
    return {
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : JSON.stringify(error?.errors || error)
    };
  }
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
            fullName: `${clerkData.firstName} ${clerkData.lastName}`.trim() || "User",
            email: clerkData.emailAddresses[0]?.emailAddress || "no-email@example.com",
            phoneNumber: clerkData.phoneNumbers[0]?.phoneNumber || "0000000000",
            address: "Not provided", // Required field - có thể cập nhật sau
            createdAt: new Date(),
            updatedAt: new Date(),
            point: 0,
            orders: []
        });

        // Revalidate cache (only works in App Router, safe to ignore in Pages Router)
        try {
            revalidatePath("/");
        } catch (revalidateError) {
            // Ignore error if called from Pages Router API routes
            // revalidatePath only works in App Router Server Actions
        }

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

        // Ưu tiên đọc từ Clerk metadata (nếu có)
        try {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(clerkId);
            const roleFromMetadata = clerkUser.publicMetadata?.role as UserRole;
            
            // Debug: Log metadata để kiểm tra
            console.log(`[Clerk Metadata] User ${clerkId} - publicMetadata:`, JSON.stringify(clerkUser.publicMetadata));
            console.log(`[Clerk Metadata] User ${clerkId} - roleFromMetadata:`, roleFromMetadata);
            
            if (roleFromMetadata && ['customer', 'staff', 'admin'].includes(roleFromMetadata)) {
                console.log(`[Clerk Metadata] Role found and valid: ${roleFromMetadata}`);
                // Nếu có role trong metadata, kiểm tra trong database để lấy userId
                if (roleFromMetadata === 'customer') {
                    const customer = await Customer.findOne({ clerkId }).select('_id');
                    if (customer) {
                        return {
                            success: true,
                            role: roleFromMetadata,
                            userId: customer._id.toString(),
                            message: "User is a customer"
                        };
                    }
                } else if (roleFromMetadata === 'staff') {
                    const staff = await Staff.findOne({ clerkId }).select('_id');
                    if (staff) {
                        return {
                            success: true,
                            role: roleFromMetadata,
                            userId: staff._id.toString(),
                            message: "User is a staff member"
                        };
                    }
                } else if (roleFromMetadata === 'admin') {
                    console.log(`[Clerk Metadata] Admin role confirmed for user ${clerkId}`);
                    return {
                        success: true,
                        role: roleFromMetadata,
                        userId: process.env.ADMIN_CLERK_ID || clerkId,
                        message: "User is an admin"
                    };
                }
            } else {
                // Role không có trong metadata hoặc không hợp lệ
                console.log(`[Clerk Metadata] No valid role found in metadata. roleFromMetadata: ${roleFromMetadata}, will fallback to database`);
            }
        } catch (metadataError) {
            // Nếu không đọc được metadata, fallback về database
            console.log("Could not read from Clerk metadata, falling back to database");
            console.error("Clerk metadata read error:", metadataError instanceof Error ? metadataError.message : String(metadataError));
        }

        // Fallback: Kiểm tra trong database
        // QUAN TRỌNG: Kiểm tra admin trước (vì admin có thể cũng có trong Customer collection)
        const adminClerkId = process.env.ADMIN_CLERK_ID;
        if (adminClerkId && clerkId === adminClerkId) {
            console.log(`[Database Fallback] Admin detected via ADMIN_CLERK_ID: ${clerkId}`);
            return {
                success: true,
                role: "admin",
                userId: adminClerkId,
                message: "User is an admin"
            };
        }
        
        // Nếu không có ADMIN_CLERK_ID trong env, thử đọc lại từ Clerk metadata một lần nữa
        // (có thể lần đầu bị lỗi tạm thời)
        if (!adminClerkId) {
            console.log(`[Database Fallback] ADMIN_CLERK_ID not set in environment, trying to read from Clerk metadata again...`);
            try {
                const client = await clerkClient();
                const clerkUser = await client.users.getUser(clerkId);
                const roleFromMetadataRetry = clerkUser.publicMetadata?.role as UserRole;
                
                if (roleFromMetadataRetry === 'admin') {
                    console.log(`[Database Fallback] Admin role confirmed from Clerk metadata on retry: ${clerkId}`);
                    return {
                        success: true,
                        role: "admin",
                        userId: clerkId,
                        message: "User is an admin (from Clerk metadata retry)"
                    };
                }
            } catch (retryError) {
                console.warn(`[Database Fallback] Could not read Clerk metadata on retry:`, retryError);
            }
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

        // Kiểm tra trong collection Customer (sau cùng vì admin/staff có thể cũng có trong đây)
        const customer = await Customer.findOne({ clerkId }).select('_id');
        if (customer) {
            return {
                success: true,
                role: "customer",
                userId: customer._id.toString(),
                message: "User is a customer"
            };
        }

        // Fallback: User không tìm thấy trong DB, thử tạo tự động nếu user tồn tại trên Clerk
        try {
            // Verify user exists on Clerk
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(clerkId);
            
            // User exists on Clerk but not in DB
            // Auto-create as customer
            const createResult = await createOrGetCustomer({
                id: clerkId,
                firstName: clerkUser.firstName || '',
                lastName: clerkUser.lastName || '',
                emailAddresses: clerkUser.emailAddresses || [],
                phoneNumbers: clerkUser.phoneNumbers || [],
            });
            
            if (createResult.success && createResult.data) {
                // Sync role to Clerk metadata
                await syncRoleToClerk(clerkId, 'customer');
                
                // Retry: Check role again after creation
                const customer = await Customer.findOne({ clerkId }).select('_id');
                if (customer) {
                    return {
                        success: true,
                        role: "customer",
                        userId: customer._id.toString(),
                        message: "User auto-created as customer"
                    };
                }
            }
        } catch (clerkError) {
            // User doesn't exist on Clerk or error creating
            // Log error but don't crash - continue to return "not found"
            console.error("Error auto-creating user from Clerk:", clerkError);
        }

        // Không tìm thấy user trong bất kỳ collection nào và không thể tạo tự động
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

/**
 * Đồng bộ role lên Clerk metadata
 */
export async function syncRoleToClerk(clerkId: string, role: UserRole): Promise<{ success: boolean; message: string; error?: string }> {
    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(clerkId, {
            publicMetadata: {
                role: role
            }
        });

        return {
            success: true,
            message: `Role ${role} synced to Clerk metadata successfully`
        };
    } catch (error) {
        console.error("Error syncing role to Clerk:", error);
        return {
            success: false,
            message: "Failed to sync role to Clerk metadata",
            error: (error as Error).message
        };
    }
}

/**
 * Cập nhật role cả Clerk và Database
 * SECURITY: Chỉ admin mới được phép đổi role của người khác
 */
export async function updateUserRole(clerkId: string, role: UserRole): Promise<{ success: boolean; message: string; error?: string }> {
    try {
        // SECURITY CHECK: Chỉ admin mới được đổi role
        const { auth } = await import('@clerk/nextjs/server');
        const { sessionClaims } = await auth();
        
        // Kiểm tra quyền của người gọi function này
        const callerRole = sessionClaims?.metadata?.role as UserRole;
        
        if (callerRole !== 'admin') {
            return {
                success: false,
                message: "Unauthorized! Only admins can change roles.",
                error: "Insufficient permissions"
            };
        }

        await connectToDatabase();

        // Sync lên Clerk metadata
        const syncResult = await syncRoleToClerk(clerkId, role);
        if (!syncResult.success) {
            return syncResult;
        }

        // Database sẽ được cập nhật thông qua các actions khác (createOrGetCustomer, etc.)
        // Role được xác định bởi collection mà user thuộc về

        return {
            success: true,
            message: `User role updated to ${role} successfully`
        };
    } catch (error) {
        console.error("Error updating user role:", error);
        return {
            success: false,
            message: "Failed to update user role",
            error: (error as Error).message
        };
    }
}