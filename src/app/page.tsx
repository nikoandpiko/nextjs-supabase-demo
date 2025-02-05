import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import CreatePost from "./components/CreatePost";
import FilterPosts from "./components/FilterPosts";
import { PostProvider } from "./context/PostContext";

export default async function Home() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PostProvider initialPosts={posts || []}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <main className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              NextJS 15 + Supabase SSR Demo
            </h1>
            <p className="text-gray-600">
              Server-side rendered posts from PostgreSQL database
            </p>
          </div>

          <CreatePost />
          <FilterPosts />
        </main>
      </div>
    </PostProvider>
  );
}
