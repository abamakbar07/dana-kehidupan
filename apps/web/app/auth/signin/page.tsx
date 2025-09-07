"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button, Input, Label } from "@dana/ui";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit">Sign in</Button>
      </form>
      <div className="mt-6">
        <h2 className="mb-2 font-medium">Or email OTP link</h2>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await signIn("email", { email, callbackUrl: "/dashboard" });
          }}
        >
          <Input placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" variant="secondary">Send</Button>
        </form>
      </div>
    </div>
  );
}

