import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
    return (
        <main className="flex h-screen w-full items-center justify-center">
            <SignIn 
                // Redirect đến callback route sau khi đăng nhập thành công
                // Callback route sẽ check role và redirect đến /admin (nếu admin) hoặc / (nếu customer)
                afterSignInUrl="/auth/callback"
                // Redirect về home nếu user hủy đăng nhập
                fallbackRedirectUrl="/"
            />
        </main>
    );
};

export default SignInPage;