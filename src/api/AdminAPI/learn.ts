import { api } from "@/lib/api";

export const createTopic = (data: { name: string }): Promise<string> =>
  api.post(`/topics/`, data);
export const createGrammar = (data: { name: string }): Promise<string> =>
  api.post(`/grammar-points/`, data);
export const createLearnBlog = (blog: FormData): Promise<string> =>
  api.post("/blogs", blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editLearnBlog = (blog: FormData, id: string): Promise<string> =>
  api.patch(`/blogs/${id}`, blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getTotalBlog = (): Promise<number> => api.get(`/blogs/total-blog`);
export const deleteBlog = (id: string): Promise<string> =>
  api.delete(`/blogs/${id}`);
