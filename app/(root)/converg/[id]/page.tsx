import ConvergCard from "@/components/cards/ConvergCard";
import { fetchConvergById } from "@/lib/actions/converg.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
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
          currentUserId={user?.id || ""}
          parentId={converg.parentId}
          content={converg.text}
          author={converg.author}
          community={converg.community}
          createdAt={converg.createdAt}
          comments={converg.children}
        />
      </div>
    </section>
  );
};
export default Page;
