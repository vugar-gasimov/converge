import Pagination from "@/components/shared/Pagination";

import ConvergCard from "@/components/cards/ConvergCard";
import { fetchPosts } from "@/lib/actions/converg.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

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
                currentUserId={user.id}
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
      <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}
