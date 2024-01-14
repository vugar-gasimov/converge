import ConvergCard from "@/components/cards/ConvergCard";
import Comment from "@/components/forms/Comment";
import { fetchConvergById } from "@/lib/actions/converg.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const revalidate = 0;

async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const converg = await fetchConvergById(params.id);

  return (
    <section className="relative">
      <div>
        <ConvergCard
          key={converg._id}
          id={converg._id}
          currentUserId={user.id}
          parentId={converg.parentId}
          content={converg.text}
          author={converg.author}
          community={converg.community}
          createdAt={converg.createdAt}
          comments={converg.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          convergId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {converg.children.map((childItem: any) => (
          <ConvergCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}
export default Page;
