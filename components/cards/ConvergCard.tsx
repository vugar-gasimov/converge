interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;

  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ConvergCard = ({
  id,
  currentUserId,
  parentId,
  content,

  author,
  community,
  createdAt,
  comments,
}: Props) => {
  return (
    <article className="">
      <h2 className="text-small-regular text-light-2">{content}</h2>
    </article>
  );
};

export default ConvergCard;
