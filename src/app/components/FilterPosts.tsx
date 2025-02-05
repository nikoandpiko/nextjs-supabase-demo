"use client";

import { useState, useEffect } from "react";
import DeleteButton from "./DeleteButton";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import { usePosts } from "../context/PostContext";

type SortOption = "newest" | "oldest" | "title";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function FilterPosts() {
  const { posts, setPosts } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.content.toLowerCase().includes(term.toLowerCase())
    );
    sortPosts(filtered, sortBy);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    sortPosts(filteredPosts, option);
  };

  const sortPosts = (postsToSort: Post[], option: SortOption) => {
    let sorted = [...postsToSort];
    switch (option) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    setFilteredPosts(sorted);
  };

  const handleDelete = (deletedId: number) => {
    const updatedPosts = posts.filter((post) => post.id !== deletedId);
    setPosts(updatedPosts);
    sortPosts(
      updatedPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      sortBy
    );
  };

  return (
    <div>
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <SortDropdown onSort={handleSort} currentSort={sortBy} />
      </div>
      <div className="grid gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.content}</p>
                  <time className="text-sm text-gray-400">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <DeleteButton postId={post.id} onDelete={handleDelete} />
              </div>
            </article>
          ))
        ) : (
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">
              {searchTerm
                ? `No posts found matching "${searchTerm}"`
                : "No posts yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
