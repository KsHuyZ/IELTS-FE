import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeExcercise } from "@/types/excercise";
import { validateError } from "@/utils/validate";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Route } from "@/constant/route";
import StepPractice from "../components/stepPractice";
import { useCreatePractice } from "../hooks/useCreatePractice";
import { useGetTopic } from "@/features/Practice/hooks/useGetTopic";
import { ICreatePractice } from "@/types/AdminType/practice";
const CreatePractice = () => {
  const { mutateAsync: createPractice } = useCreatePractice();
  const nav = useNavigate();
  const { data: topics } = useGetTopic();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreatePractice>({
    defaultValues: {
      topicId: "",
      type: TypeExcercise.Listening,
      image: undefined,
      name: "",
    },
  });
  const onSubmit = async (values: ICreatePractice) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "image") {
          formData.append(key, value);
        }
      });

      if (values) {
        formData.append("image", values.image[0]);
      }

      const res = await createPractice(formData);
      nav(`${Route.CreatePracticeDetail}/${res.type}/${res.id}`);
    } catch (error) {
      toast.error(validateError(error));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full w-full p-8 space-y-5">
      <div className="w-9/12 mx-auto">
        <StepPractice step={0} />
      </div>
      <div className="w-10/12 mx-auto bg-white rounded-lg shadow-md p-10">
        <h2 className="text-xl font-bold mb-4 text-center">
          Create New Practice
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between w-full gap-5">
              <Label htmlFor="name" className="flex gap-2 w-32">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Reading Practice"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between w-full gap-5">
              <Label htmlFor="type" className="flex gap-2 w-32">
                Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as TypeExcercise)
                }
                defaultValue={TypeExcercise.Listening}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TypeExcercise.Listening}>
                    Listening
                  </SelectItem>
                  <SelectItem value={TypeExcercise.Reading}>Reading</SelectItem>
                  <SelectItem value={TypeExcercise.Writing}>Writing</SelectItem>
                  <SelectItem value={TypeExcercise.Speaking}>
                    Speaking
                  </SelectItem>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("type", { required: "Type is required" })}
              />
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* File Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between w-full gap-5">
              <Label htmlFor="image" className="flex gap-2 w-32">
                Image <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image"
                type="file"
                {...register("image", { required: "File is required" })}
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
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
          <Button
            isLoading={loading}
            type="submit"
            className="w-full border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white font-bold"
          >
            Create Basic Practice
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePractice;
