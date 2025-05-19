import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route } from "@/constant/route";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmail() {
  const nav = useNavigate();
  return (
    <div className="flex h-fit items-center justify-center bg-gray-50 p-5">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription className="text-base">
            We've sent a password reset link to your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click on the link to reset your
            password. The link will expire in 30 minutes.
          </p>
          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-sm font-medium">Didn't receive an email?</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-4 w-4 text-gray-500" />
                <span>Check your spam or junk folder</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="mr-2 h-4 w-4 text-gray-500" />
                <span>Make sure the email address you entered is correct</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => nav(Route.Login)}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
