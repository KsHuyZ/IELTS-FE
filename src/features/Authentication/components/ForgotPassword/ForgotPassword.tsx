import { forgotPassword } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route } from "@/constant/route";
import { validateError } from "@/utils/validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LiaSpinnerSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const schema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
const Forgotpassword = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = form.handleSubmit(
    async (values: { email: string }): Promise<void> => {
      setSubmitting(true);
      try {
        await forgotPassword(values);
      } catch (error) {
        setSubmitting(false);
        toast.error(validateError(error));
      } finally {
        nav(Route.ConfirmEmail);
      }
    }
  );
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-6 w-6 text-gray-600" />
        </div>
        <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="pb-3">
                  <FormLabel htmlFor="email" className="text-text">
                    Email<span className="text-red-500  pl-2">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full mt-2 text-sm p-4"
                      type="email"
                      id="email"
                      placeholder="ielt@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex-rows gap-4 text-white p-4 rounded-lg w-full bg-[#164C7E] hover:bg-[#164C7E]/80 font-bold"
              isLoading={submitting}
            >
              Send Request Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
    // <Form {...form}>
    //   <form
    //     onSubmit={(e) => {
    //       e.preventDefault()
    //       void handleSubmit()
    //     }}
    //     className="w-9/12 bg-white mx-auto mt-10 p-5 rounded-lg h-5/6 flex flex-col justify-center space-y-10"
    //   >
    //     <div className="flex flex-col items-center justify-center">
    //       <span className="text-text text-center">
    //         Please Enter your Email to request reset your password!
    //       </span>
    //       <img
    //         src="/images/resetpassword.png"
    //         alt="reset"
    //         className="w-56 h-44 flex items-center justify-center"
    //       />
    //     </div>
    //     <FormField
    //       control={form.control}
    //       name="email"
    //       render={({ field }) => (
    //         <FormItem className="pb-3">
    //           <FormLabel htmlFor="email" className="text-text">
    //             Email<span className="text-red-500  pl-2">*</span>
    //           </FormLabel>
    //           <FormControl>
    //             <Input
    //               className="w-full mt-2 text-sm p-4"
    //               type="email"
    //               id="email"
    //               placeholder="relaxStream@gmail.com"
    //               {...field}
    //             />
    //           </FormControl>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <Button
    //       type="submit"
    //       className="bg-subMain transitions hover:bg-main flex-rows gap-4 text-white p-4 rounded-lg w-full"
    //       disabled={submitting}
    //     >
    //       Send Request Reset Password
    //       {submitting ? (
    //         <LiaSpinnerSolid className="ml-2 inline animate-spin" />
    //       ) : (
    //         ''
    //       )}
    //     </Button>
    //   </form>
    // </Form>
  );
};

export default Forgotpassword;
