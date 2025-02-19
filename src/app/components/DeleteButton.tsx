"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Toast from "./Toast";

export default function DeleteButton({
  postId,
  onDelete,
}: {
  postId: number;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'}>({
    show: false,
    message: "",
    type: "success"
  });
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      
      if (error) throw error;
      
      onDelete(postId);
      router.refresh();
    } catch (error) {
      console.error(error);
      let errorMessage = "An unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }
      
      setToast({
        show: true,
        message: `Error: ${errorMessage}`,
        type: "error"
      });
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }
  
  function handleToastClose() {
    setToast(prev => ({ ...prev, show: false }));
  }

  return (
    <div className="relative">
      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-500 hover:text-red-700"
        disabled={isDeleting}
      >
        Delete
      </button>

      {showConfirm && (
        <div className="absolute right-0 top-8 p-4 bg-white rounded-lg shadow-xl border z-10">
          <p className="mb-4 text-gray-800">Delete this post?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Yes"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
