import { useNavigate, useParams } from "react-router-dom";
import { useGetFullPractice } from "../hooks/useGetFullPractices";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TypeExcercise } from "@/types/excercise";
import StepEditPractice from "../components/stepEditPractice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Route } from "@/constant/route";
import {
  useGetFullPracticeDetailAdmin,
  useGetPracticeDetail,
} from "../hooks/useGetPracticeDetail";
import { ICreatePractice } from "@/types/AdminType/practice";
import { IPracticeDetail } from "@/types/AdminType/exam";
import { editPractice } from "@/api/AdminAPI/practice";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { useGetTopic } from "@/features/Practice/hooks/useGetTopic";
import { ArrowLeft } from "lucide-react";

const EditPractice = () => {
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useGetFullPracticeDetailAdmin(id ?? "");
  const nav = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { data: topics } = useGetTopic();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICreatePractice>({
    defaultValues: {
      name: "",
      type: TypeExcercise.Listening,
      image: undefined,
      topicId: "",
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        type: (data.type as TypeExcercise) || TypeExcercise.Listening,
        topicId: data.topic.id,
      });
      setPreviewImage(data.image);
    }
  }, [data, reset]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };
  const onSubmit = async (values: ICreatePractice) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "image") {
          formData.append(key, value.toString());
        }
      });

      if (values.image && values.image[0]) {
        formData.append("image", values.image[0]);
      }
      const res = await editPractice(formData, data?.id ?? "");
      toast.success("Edit Practice Success!");
      nav(`${Route.EditPracticeDetail}/${res.type}/${res.id}`);
    } catch (error) {
      toast.error(validateError(error));
    } finally {
      refetch();
      setLoading(false);
    }
  };
  return (
    <div className="h-full w-full p-8 space-y-5 relative">
      <div className="w-9/12 mx-auto">
        <StepEditPractice step={0} />
      </div>
      <ArrowLeft
        className="absolute top-3 cursor-pointer left-10"
        onClick={() => nav(-1)}
      />
      <div className="w-10/12 mx-auto bg-white rounded-lg shadow-md p-10">
        <h2 className="text-xl font-bold mb-4 text-center">
          Edit Your Practice
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between items-center w-full gap-5">
              <Label htmlFor="name" className="flex gap-2 w-32">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Reading Exam"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          {/* File Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between items-center w-full gap-5">
              <Label htmlFor="file" className="flex gap-2 w-32">
                Image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={handleFileChange}
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
                  alt="Exam Image"
                  className="mt-2 max-w-xs rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
          {/* Year Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between w-full gap-5">
              <Label htmlFor="topicId" className="flex gap-2 w-32">
                Topic <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("topicId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics?.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("topicId", {
                  required: "Topic is required",
                })}
              />
            </div>
            {errors.topicId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.topicId.message}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex flex-col w-full gap-4">
            <Button
              isLoading={loading}
              type="submit"
              className="w-full rounded-full border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white font-bold"
            >
              Edit Basic Practice
            </Button>
            <Button
              type="submit"
              className="w-full rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-white font-bold"
              onClick={() =>
                nav(`${Route.EditPracticeDetail}/${data?.type}/${id}`)
              }
            >
              Continute Edit Detail
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPractice;
