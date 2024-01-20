import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ConvergCard from "../cards/ConvergCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ConvergsTab = async ({
  currentUserId,
  accountId,
  accountType,
}: Props) => {
  // Fetch profile convergs
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.convergs.map((converg: any) => (
        <ConvergCard
          key={converg._id}
          id={converg._id}
          currentUserId={currentUserId}
          parentId={converg.parentId}
          content={converg.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: converg.author.name,
                  image: converg.author.image,
                  id: converg.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : converg.community
          }
          createdAt={converg.createdAt}
          comments={converg.children}
        />
      ))}
    </section>
  );
};
export default ConvergsTab;
