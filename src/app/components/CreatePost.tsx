"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { usePosts } from "../context/PostContext";
import Toast from "./Toast";

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 500;

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'}>({
    show: false,
    message: "",
    type: "success"
  });
  const [errors, setErrors] = useState({ title: "", content: "" });
  const { addPost } = usePosts();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function validateForm() {
    const newErrors = { title: "", content: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    } else if (content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
  
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ title, content }])
        .select()
        .single();
  
      if (error) throw error;
      if (data) addPost(data);
  
      setTitle("");
      setContent("");
      setToast({
        show: true,
        message: "Post created successfully!",
        type: "success"
      });
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error:", error.message);
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = (error as { message: string }).message;
        console.error("Error:", errorMessage);
      } else {
        console.error(errorMessage);
      }
      
      setToast({
        show: true,
        message: `Error: ${errorMessage}`,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
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
      
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 mb-8"
      >
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-gray-600">Title</label>
            <span className="text-sm text-gray-500">
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              if (e.target.value.length <= MAX_TITLE_LENGTH) {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
            placeholder="Post title"
            className={`w-full p-2 border rounded text-gray-800 placeholder-gray-400 ${
              errors.title ? "border-red-500" : ""
            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-red-500 text-sm">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <label className="text-sm text-gray-600">Content</label>
            <span className="text-sm text-gray-500">
              {content.length}/{MAX_CONTENT_LENGTH}
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }
            }}
            placeholder="Post content"
            className={`w-full p-2 border rounded h-32 min-h-[42] text-gray-800 placeholder-gray-400 ${
              errors.content ? "border-red-500" : ""
            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="mt-1 text-red-500 text-sm">{errors.content}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
