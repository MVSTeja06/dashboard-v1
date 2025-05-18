import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const GoogleIcon = (props: object) => (
  <svg role="img" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
    />
  </svg>
);

interface SignUpFormProps extends React.ComponentProps<"div"> {
  setNeedsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SignUpForm({ setNeedsSignUp }: SignUpFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Hello there!</h1>
        <p className="text-muted-foreground text-balance">
          Create your Account today!
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <div className="text-center text-sm">
        Have an account already?{" "}
        <a
          href="#"
          className="underline underline-offset-4"
          onClick={() => setNeedsSignUp(false)}
        >
          Login
        </a>
      </div>
      <Button type="submit" className="w-full">Create account</Button>
    </div>
  );
}
