import { editExam } from "@/api/AdminAPI/exam";
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
import { ICreateExam } from "@/types/AdminType/exam";
import { TypeExcercise } from "@/types/excercise";
import { validateError } from "@/utils/validate";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Route } from "@/constant/route";
import { useGetFullExamDetail } from "./CreateReading/hooks/useGetFullExamDetail";
import StepEdit from "../components/stepEdit";
const EditExam = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetFullExamDetail(id ?? "");
  const nav = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<string | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICreateExam>({
    defaultValues: {
      name: "",
      type: TypeExcercise.Listening,
      file: undefined,
      audio: undefined,
      year: 2024,
    },
  });
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        type: (data.type as TypeExcercise) || TypeExcercise.Listening,
        year: data.year || 2024,
      });
      setPreviewImage(data.image);
      setPreviewAudio(data.audio);
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
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setPreviewAudio(audioUrl);
      return () => URL.revokeObjectURL(audioUrl);
    }
  };

  const selectedType = watch("type");
  const selectedYear = watch("year");
  const onSubmit = async (values: ICreateExam) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (value && key !== "file" && key !== "audio") {
          formData.append(key, value.toString());
        }
      });

      if (values.file && values.file[0]) {
        formData.append("file", values.file[0]);
      }
      if (values.audio && values.audio[0]) {
        formData.append("audio", values.audio[0]);
      }
      const res = await editExam(formData, data?.id ?? "");
      toast.success("Edit Exam Success!");
      nav(`${Route.EditExamDetail}/${res.type}/${res.id}`);
    } catch (error) {
      toast.error(validateError(error));
    } finally {
      setLoading(false);
    }
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, index) => currentYear - index);
  return (
    <div className="h-full w-full p-8 space-y-5">
      <div className="w-9/12 mx-auto">
        <StepEdit step={0} />
      </div>
      <div className="w-10/12 mx-auto bg-white rounded-lg shadow-md p-10">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Your Exam</h2>
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
                id="file"
                type="file"
                accept="image/*"
                {...register("file")}
                onChange={handleFileChange}
              />
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
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

          {/* Audio Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between items-center w-full gap-5">
              <Label htmlFor="audio" className="flex gap-2 w-32">
                Audio
              </Label>
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                {...register("audio")}
                onChange={handleAudioChange}
                disabled={selectedType !== TypeExcercise.Listening}
              />
            </div>
            {previewAudio && selectedType === TypeExcercise.Listening && (
              <div className="mt-4 w-full">
                <audio controls src={previewAudio} className="w-full pl-28">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          {/* Year Field */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-between items-center w-full gap-5">
              <Label htmlFor="year" className="flex gap-2 w-32">
                Year <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("year", Number(value))}
                value={String(selectedYear)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register("year", {
                  required: "Year is required",
                  valueAsNumber: true,
                })}
              />
            </div>
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>
          {/* Submit Button */}
          <div className="flex flex-col w-full gap-4">
            <Button
              isLoading={loading}
              type="submit"
              className="w-full rounded-full border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white font-bold"
            >
              Edit Basic Exam
            </Button>
            <Button
              type="submit"
              className="w-full rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-white font-bold"
              onClick={() => nav(`${Route.EditExamDetail}/${data?.type}/${id}`)}
            >
              Continute Edit Detail
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExam;
