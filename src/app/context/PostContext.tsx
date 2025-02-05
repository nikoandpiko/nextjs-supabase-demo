"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface PostContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({
  children,
  initialPosts,
}: {
  children: ReactNode;
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within PostProvider");
  return context;
}
