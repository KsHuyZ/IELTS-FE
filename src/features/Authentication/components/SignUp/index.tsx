import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpPayload, signUpSchema } from "@/validator/auth";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaFacebookF, FaGoogle } from "react-icons/fa";
import { useSignUp } from "./hooks/useSignUp";

const SignUpForm = () => {
  const { mutateAsync: signUp, isPending } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });
  const handleSubmit = form.handleSubmit(async (values) => {
    await signUp(values);
  });

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="rounded-lg space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col space-y-3 items-start">
                      <Label
                        htmlFor="name"
                        className="text-[#6F6F6E] pl-3 mt-3"
                      >
                        Full Name:
                      </Label>
                      <Input
                        id="fullName"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col space-y-3 items-start">
                      <Label htmlFor="email" className="text-[#6F6F6E] pl-3">
                        Email:
                      </Label>
                      <Input
                        id="email"
                        type="email"
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
                <FormItem>
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col space-y-3 items-start">
                      <Label
                        htmlFor="passwordConfirm"
                        className="text-[#6F6F6E] pl-3"
                      >
                        Password Confirm:
                      </Label>
                      <div className="relative w-full">
                        <Input
                          id="passwordConfirm"
                          type={showPasswordConfirm ? "text" : "password"}
                          className="bg-[#D9D9D9] rounded-full pr-10 w-full"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswordConfirm(!showPasswordConfirm)
                          }
                          className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                        >
                          {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              isLoading={isPending}
              type="submit"
              className="w-full rounded-full font-bold text-white bg-[#66B032] hover:bg-[#66B032]/80 mb-3"
            >
              Sign Up
            </Button>
            {/* <hr /> */}
            {/* <div className="flex flex-col gap-3">
              <p className="text-center text-[#6F6F6E]">
                Or quickly sign up with:
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-[#db4437] w-1/2 text-white flex gap-3 rounded-lg">
                  <FaGoogle />
                  <span className="font-bold">GOOGLE</span>
                </Button>
                <Button className="bg-[#3B5998] w-1/2 text-white flex gap-3 rounded-lg">
                  <FaFacebookF />
                  <span className="font-bold">FACEBOOK</span>
                </Button>
              </div>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
