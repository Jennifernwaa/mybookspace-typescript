'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { Label } from "@/components/ui/label"

type LoginFormProps = {
  type: 'sign-in' | 'sign-up';
} & React.ComponentProps<"div">;

export function LoginForm({ type, className, ...props }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement)?.value;
    var isValid = true; // Let's use isValid for the overall form state


    try {
        const endpoint = type === 'sign-up' ? '/api/auth/sign-up' : '/api/auth/sign-in';
        const payload: Record<string, string> = { email, password };

        if (type === 'sign-up') {
          if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
          }
          payload.confirmPassword = confirmPassword;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

          // Store user ID in localStorage for dashboard access
          localStorage.setItem('userId', String(data.user._id));
          localStorage.setItem('userEmail', data.user.email);
          
          router.push('/dashboard');
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className=" bg-muted glass-effect overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl font-bold">
                    {type === 'sign-in' ? 'Welcome Back!' : 'Welcome!'}
                    </h1>
                  <p className="text-muted-foreground text-balance mt-2">
                    {type === 'sign-in' ? 'Login to your myBookSpace account!' : 'Create a myBookSpace account'}
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      {type === 'sign-in' ? 'Forgot Password?' : ''}
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                  {type === 'sign-up' && (
                    <>
                      <div className="grid gap-3">
                        <div className="flex items-center">
                          <Label htmlFor="password">Confirm Password</Label>
                        </div>
                        <Input id="confirmPassword" type="password" required />
                      </div>
                    </>
                  )}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' 
                    ? 'Sign In' : 'Sign Up'}
                </Button>

                {error && <div className="text-red-500 text-sm">{error}</div>}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" type="button" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="sr-only">Login with Google</span>
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {type === 'sign-in' ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <a href="/sign-up" className="underline underline-offset-4">
                        Sign up
                      </a>
                    </>
                  ) : (
                    <>
                      Have an account?{" "}
                      <a href="/sign-in" className="underline underline-offset-4">
                        Sign in
                      </a>
                    </>
                  )}
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="../public/vercel.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>
  )
}
