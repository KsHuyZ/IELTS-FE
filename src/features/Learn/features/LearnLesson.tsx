import { useParams } from "react-router-dom";
import { useGetBloDetail } from "./hooks/useGetBlogDetail";

const LearnLesson = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetBloDetail(id ?? "");
  return (
    <div className="bg-white w-11/12 mx-auto h-full p-3">
      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: data?.content ?? "" }} />
      </article>
    </div>
  );
};

export default LearnLesson;
