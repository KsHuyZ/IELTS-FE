import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { practiceTabs, statusFilters } from "@/constant/filter";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  IRequestExcercisePractice,
  StatusExcercise,
  TypeExcercise,
} from "@/types/excercise";
import { useGetPracticeExcercise } from "./hooks/useGetPracticeExcercise";
import { useGetTopic } from "./hooks/useGetTopic";
import DialogPracticeConfirm from "./components/DialogPracticeConfirm";
import { EQuestionType } from "@/types/ExamType/exam";
import { ESubcription } from "@/types/auth";
import { useAuthStore } from "@/store/auth";
import DialogUpgrade from "../Exam/components/DialogUpgrade";
const questionTypeDisplayNames: Record<string, string> = {
  [EQuestionType.TextBox]: "Text Box",
  [EQuestionType.SingleChoice]: "Single Choice",
  [EQuestionType.BlankPassageDrag]: "Blank Passage Drag",
  [EQuestionType.BlankPassageTextbox]: "Blank Passage Textbox",
  [EQuestionType.BlankPassageImageTextbox]: "Blank Image Textbox",
};
export function Practice() {
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
  const { subscription } = useAuthStore();
  const [openDia, setOpenDia] = useState(false);
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<IRequestExcercisePractice>(() => {
    return {
      status: searchParams.get("status") as StatusExcercise | undefined,
      year: searchParams.get("year") || undefined,
      type: (searchParams.get("type") as TypeExcercise) ?? "reading",
      questionType: searchParams.get("questionType") as EQuestionType,
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
    };
  });
  const { data, refetch } = useGetPracticeExcercise(params);
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (params.status) newSearchParams.set("status", params.status);
    if (params.topic) newSearchParams.set("topic", params.topic);
    if (params.type) newSearchParams.set("type", params.type);
    if (params.questionType)
      newSearchParams.set("questionType", params.questionType);
    if (params.page != undefined)
      newSearchParams.set("page", params.page.toString());
    setSearchParams(newSearchParams);
  }, [params, setSearchParams]);
  const { data: topics } = useGetTopic();
  useEffect(() => {
    refetch();
  }, [params]);
  const handleStartPractice = (id: string, type: string) => {
    if (subscription === ESubcription.Free && type === "writing") {
      setOpenSubscriptionDialog(true);
      return;
    }
    setId(id);
    setType(type);
    setOpenDia(true);
  };
  return (
    <div className="flex h-full p-8 gap-14 w-11/12">
      <DialogUpgrade
        openSubscriptionDialog={openSubscriptionDialog}
        setOpenSubscriptionDialog={setOpenSubscriptionDialog}
      />
      <DialogPracticeConfirm
        openDia={openDia}
        setOpenDia={setOpenDia}
        title={`ARE YOU READY TO START THE ${type.toUpperCase()} TEST?`}
        id={id}
        type={type}
      />
      <div className="w-64 border bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Status</h3>
            <div className="space-y-2">
              <RadioGroup
                value={params.status || ""}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    status: value as StatusExcercise,
                  }));
                }}
              >
                {statusFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={filter.id} id={filter.id} />
                    <Label htmlFor={filter.id}>{filter.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Topic</h3>
            <div className="space-y-2">
              <RadioGroup
                value={params.topic || ""}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    topic: value,
                  }));
                }}
              >
                {topics?.map((topic) => (
                  <div key={topic.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={topic.id} id={topic.id} />
                    <Label htmlFor={topic.id}>{topic.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Type Question</h3>
            <div className="space-y-2">
              <RadioGroup
                value={params.questionType || ""}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    questionType: value,
                  }));
                }}
              >
                {Object.entries(questionTypeDisplayNames).map(
                  ([questionType, label]) => (
                    <div
                      key={questionType}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={questionType} id={questionType} />
                      <Label htmlFor={questionType}>{label}</Label>
                    </div>
                  )
                )}
              </RadioGroup>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => setParams({})}
          >
            Clear Filter
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-between flex-col items-center">
        <Tabs
          value={params.type}
          defaultValue="reading"
          className="w-full grid-cols-4 gap-6"
          onValueChange={(value) => {
            setParams((prev) => ({ ...prev, type: value as TypeExcercise }));
          }}
        >
          <TabsList className="w-full justify-between">
            {practiceTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="w-full hover:text-[#164C7E]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {practiceTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {data?.data?.map((card) => {
                  return (
                    <Card key={card.id} className="overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-full h-24 object-cover"
                        />
                      </CardContent>
                      <CardFooter className="flex flex-col items-center gap-2 p-3">
                        <p
                          className="text-sm text-center line-clamp-1"
                          title={card.name}
                        >
                          {card.name}
                        </p>
                        <Button
                          className={cn(
                            card.status === StatusExcercise.NotStarted
                              ? "border-2 border-[#164C7E] bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
                              : card.status === StatusExcercise.InProgress
                              ? "border-2 border-[#188F09] text-[#188F09] hover:bg-[#188F09] hover:text-white bg-white"
                              : "border-2 bg-white border-red-500 text-red-500 hover:text-white hover:bg-red-500"
                          )}
                          onClick={() =>
                            handleStartPractice(card.id, card.type)
                          }
                        >
                          {card.status === StatusExcercise.Completed
                            ? "RETRY"
                            : card.status === StatusExcercise.InProgress
                            ? "CONTINUTE"
                            : "START"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        {(data?.pages || 0) > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        page: (data?.page ?? 1) - 1,
                      }));
                    }}
                    className={
                      data?.page === 1 ? "opacity-50 pointer-events-none" : ""
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: data?.pages ?? 1 },
                  (_, index) => index + 1
                ).map((page) => (
                  <PaginationItem
                    key={page}
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        page: page,
                      }));
                    }}
                  >
                    <PaginationLink isActive={page === data?.page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        page: (data?.page ?? 1) + 1,
                      }));
                    }}
                    className={
                      data?.page === data?.pages
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
