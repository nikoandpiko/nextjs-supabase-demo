"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ 
  message, 
  type = "success", 
  onClose,
  duration = 3000
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  }[type];

  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
  };

  return (
    <div 
      className={`fixed top-4 right-4 px-6 py-3 ${bgColor} text-white rounded-lg shadow-lg z-20`}
      style={animationStyles}
    >
      {message}
    </div>
  );
}
