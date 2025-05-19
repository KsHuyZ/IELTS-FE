import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SignInPayload, loginSchema } from "@/validator/auth";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "./hooks/useLogin";
import { Route } from "@/constant/route";
const Login = () => {
  const { mutateAsync: signIn, isPending } = useLogin();
  const form = useForm<SignInPayload>({
    resolver: zodResolver(loginSchema),
  });
  const nav = useNavigate()
  const [showPassword, setShowPassword] = useState(false);

  const { handleSubmit } = form;
  const onSubmit = async (values: SignInPayload) => {
    await signIn(values);
  };
  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="pb-3 mt-3">
                <FormControl>
                  <div className="flex flex-col space-y-3 items-start">
                    <Label htmlFor="email" className="text-[#6F6F6E] pl-3">
                      Email:
                    </Label>
                    <Input
                      id="email"
                      className="bg-[#D9D9D9] rounded-full"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="pb-3">
                <FormControl>
                  <div className="flex flex-col space-y-3 items-start">
                    <Label htmlFor="password" className="text-[#6F6F6E] pl-3">
                      Password:
                    </Label>
                    <div className="relative w-full">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="bg-[#D9D9D9] rounded-full pr-10 w-full"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-2 mb-3 pl-3">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-xs text-center text-[#6F6F6E]"
              >
                Remember me
              </Label>
            </div>
            <Link to={Route.ForgotPassword} className="text-sm text-[#6F6F6E] hover:underline hover:text-[#164C7E]">
              Forgot Password ?
            </Link>
          </div>

          <Button
            isLoading={isPending}
            type="submit"
            className="w-full rounded-full bg-[#66B032] hover:bg-[#66B032]/80 text-white font-bold"
          >
            Login
          </Button>
        </form>
      </Form>
      {/* <hr /> */}
      {/* <div className="flex flex-col gap-3">
        <p className="text-center text-[#6F6F6E]">Or quickly log in with:</p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-[#db4437] w-1/2 text-white flex gap-3 rounded-lg">
            <FaGoogle />
            <span className="font-bold">GOOGLE</span>
          </Button>
          <Button className="bg-[#3B5998] w-1/2 text-white flex gap-3 rounded-lg">
            {" "}
            <FaFacebookF />
            <span className="font-bold">FACEBOOK</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
