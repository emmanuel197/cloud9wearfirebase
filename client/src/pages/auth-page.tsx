import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Redirect } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Registration schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(1, "Full name is required"),
  role: z.enum(["customer", "supplier"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useLanguage();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login form
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      role: "customer",
    },
  });
  
  // Redirect if already logged in - IMPORTANT: Must be after all hook calls
  if (user) {
    if (user.role === "admin") {
      return <Redirect to="/admin" />;
    } else if (user.role === "supplier") {
      return <Redirect to="/supplier" />;
    } else {
      return <Redirect to="/" />;
    }
  }

  // Form submission handlers
  const onLoginSubmit = (values: LoginValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Tabs
          defaultValue="login"
          className="w-full max-w-md"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("auth.login.tabTitle")}</TabsTrigger>
            <TabsTrigger value="register">{t("auth.register.tabTitle")}</TabsTrigger>
          </TabsList>

          {/* Login Form */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t("auth.login.title")}</CardTitle>
                <CardDescription>{t("auth.login.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.login.username")}</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.login.password")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending
                        ? t("auth.login.loggingIn")
                        : t("auth.login.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="link"
                  onClick={() => setActiveTab("register")}
                >
                  {t("auth.login.registerLink")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Register Form */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t("auth.register.title")}</CardTitle>
                <CardDescription>{t("auth.register.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.register.fullName")}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.register.email")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.register.username")}</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.register.password")}</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.register.role")}</FormLabel>
                          <div className="flex gap-4">
                            <Button
                              type="button"
                              variant={field.value === "customer" ? "default" : "outline"}
                              className="flex-1"
                              onClick={() => registerForm.setValue("role", "customer")}
                            >
                              {t("auth.register.customerRole")}
                            </Button>
                            <Button
                              type="button"
                              variant={field.value === "supplier" ? "default" : "outline"}
                              className="flex-1"
                              onClick={() => registerForm.setValue("role", "supplier")}
                            >
                              {t("auth.register.supplierRole")}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending
                        ? t("auth.register.creatingAccount")
                        : t("auth.register.submit")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="link"
                  onClick={() => setActiveTab("login")}
                >
                  {t("auth.register.loginLink")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right side - Hero section */}
      <div className="hidden lg:flex flex-1 bg-primary">
        <div className="flex flex-col justify-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">
            {t("auth.hero.title")}
          </h1>
          <p className="text-xl mb-8 opacity-80">
            {t("auth.hero.subtitle")}
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>{t("auth.hero.benefit1")}</span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>{t("auth.hero.benefit2")}</span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>{t("auth.hero.benefit3")}</span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>{t("auth.hero.benefit4")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
