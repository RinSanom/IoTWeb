"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  children: React.ReactNode;
  defaultMode?: "login" | "register";
}

export default function AuthModal({ children, defaultMode = "login" }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  const handleClose = () => {
    setIsOpen(false);
    setMode("login"); // Reset to login when closing
  };

  const switchToLogin = () => setMode("login");
  const switchToRegister = () => setMode("register");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {mode === "login" ? (
          <LoginForm 
            onSwitchToRegister={switchToRegister} 
            onClose={handleClose}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchToLogin} 
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
