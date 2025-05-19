import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBlog } from "./hooks/useCreateBlog";
import TextEditorImage from "@/components/TextEditor/TextEditor";
import { useGetGrammar } from "@/features/Learn/hooks/useGetGrammar";
import { useGetTopics } from "@/features/Learn/hooks/useGetTopics";
import { useNavigate, useParams } from "react-router-dom";
import { Route } from "@/constant/route";
import { useGetBloDetail } from "@/features/Learn/features/hooks/useGetBlogDetail";
import { useEditBlog } from "./hooks/useEditBlog";

interface BlogFormData {
  title: string;
  image: File | null;
  content: string;
  topicId: string;
  grammarPointId: string;
}

const ManageLearn = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { mutateAsync: createBlog, isPending } = useCreateBlog();
  const { mutateAsync: editBlog, isPending: isPendingEdit } = useEditBlog(
    id ?? ""
  );
  const { data: grammars } = useGetGrammar();
  const { data: topics } = useGetTopics();
  const { data: blogData } = useGetBloDetail(id ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    blogData?.image || null
  );
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    image: null,
    content: "",
    topicId: "",
    grammarPointId: "",
  });
  useEffect(() => {
    if (isEditing && blogData) {
      setFormData((prev) => ({
        ...prev,
        title: blogData.title || "",
        image: null,
        content: blogData.content || "",
      }));
      setImagePreview(blogData.image || null);
    }
  }, [isEditing, blogData]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const nav = useNavigate();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(blogData?.image || null);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      if (name === "topicId") {
        // Treat "none" as an empty selection
        const newTopicId = value === "none" ? "" : value;
        return { ...prev, topicId: newTopicId, grammarPointId: "" };
      }
      if (name === "grammarPointId") {
        // Treat "none" as an empty selection
        const newGrammarPointId = value === "none" ? "" : value;
        return { ...prev, grammarPointId: newGrammarPointId, topicId: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.image) {
        payload.append("image", formData.image);
      }
      payload.append("content", formData.content);

      if (formData.topicId) payload.append("topicId", formData.topicId);
      if (formData.grammarPointId)
        payload.append("grammarPointId", formData.grammarPointId);

      if (isEditing) {
        await editBlog(payload);
      } else {
        await createBlog(payload);
      }
    } catch (error) {
      console.error("Error blog:", error);
    } finally {
      setFormData({
        title: "",
        image: null,
        content: "",
        topicId: "",
        grammarPointId: "",
      });
      nav(Route.Learn);
    }
  };

  return (
    <div className="h-full w-full p-8 space-y-5">
      <div className="max-w-4xl bg-white shadow rounded-lg mx-auto p-6">
        <h1 className="text-xl text-center font-bold mb-6">
          {isEditing ? "Edit Learn Blog" : "Create Learn Blog"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              required
              className="mt-1"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image <span className="text-red-500">*</span>
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#188F09] file:text-white
                hover:file:bg-[#136b07]"
            />
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-auto max-h-48 object-contain"
                />
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <TextEditorImage
              content={formData.content}
              onChange={handleContentChange}
            />
          </div>
          {!isEditing && (
            <>
              <div>
                <label
                  htmlFor="topicId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Topic <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("topicId", value)
                  }
                  value={formData.topicId || "none"}
                  disabled={!!formData.grammarPointId}
                  required={!formData.grammarPointId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {topics?.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grammar Point ID */}
              <div>
                <label
                  htmlFor="grammarPointId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Grammar Point <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("grammarPointId", value)
                  }
                  value={formData.grammarPointId || "none"}
                  disabled={!!formData.topicId}
                  required={!formData.topicId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a grammar point" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {grammars?.map((grammar) => (
                      <SelectItem key={grammar.id} value={grammar.id}>
                        {grammar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {/* Submit Button */}
          <div className="mt-6">
            <Button
              isLoading={isPending || isPendingEdit}
              type="submit"
              className="w-full border-2 rounded-full border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white font-bold"
            >
              {isEditing ? "Update Learn Blog" : "Create Learn Blog"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageLearn;
