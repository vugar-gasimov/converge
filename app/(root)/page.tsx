// import { UserButton } from "@clerk/nextjs";

import ConvergCard from "@/components/cards/ConvergCard";
import { fetchPosts } from "@/lib/actions/converg.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      {/* <UserButton afterSignOutUrl="/" /> */}
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No convergs found.</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <ConvergCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
