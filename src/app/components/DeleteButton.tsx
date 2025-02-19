"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  postId,
  onDelete,
}: {
  postId: number;
  onDelete: (id: number) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await supabase.from("posts").delete().eq("id", postId);
      onDelete(postId); // This triggers the toast in the parent component
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  }

  return (
    <div className="relative">
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
