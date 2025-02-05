"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { usePosts } from "../context/PostContext";

const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 500;

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const router = useRouter();
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
    if (!validateForm()) return;

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
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative">
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg z-50">
          Post created successfully!
        </div>
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
            }`}
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
            className={`w-full p-2 border rounded h-32 text-gray-800 placeholder-gray-400 ${
              errors.content ? "border-red-500" : ""
            }`}
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
