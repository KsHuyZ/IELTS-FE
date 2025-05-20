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
import { useGetExcercise } from "./hooks/useGetExcercise";
import { useEffect, useState } from "react";
import {
  IRequestExcercise,
  StatusExcercise,
  TypeExcercise,
} from "@/types/excercise";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useGetYear } from "./hooks/useGetYear";
import { examTabs, statusFilters } from "@/constant/filter";
import { useNavigate, useSearchParams } from "react-router-dom";
import DialogConfirm from "./components/DialogConfirm";
import { formatMillisecondsToMMSS } from "@/utils/time";
import { useAuthStore } from "@/store/auth";
import DialogUpgrade from "./components/DialogUpgrade";
import { ESubcription } from "@/types/auth";
import { Route } from "@/constant/route";

export function Exam() {
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState(false);
  const { subscription } = useAuthStore();
  const nav = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<IRequestExcercise>(() => {
    return {
      status: searchParams.get("status") as StatusExcercise | undefined,
      year: searchParams.get("year") || undefined,
      type: (searchParams.get("type") as TypeExcercise) ?? "reading",
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
    };
  });
  const { data, refetch } = useGetExcercise(params);
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (params.status) newSearchParams.set("status", params.status);
    if (params.year) newSearchParams.set("year", params.year);
    if (params.type) newSearchParams.set("type", params.type);
    if (params.page != undefined)
      newSearchParams.set("page", params.page.toString());
    setSearchParams(newSearchParams);
  }, [params, setSearchParams]);
  const { data: year } = useGetYear();
  const yearString = Array.isArray(year) ? year.map(String) : [];
  useEffect(() => {
    refetch();
  }, [params]);
  const handleStartExam = (id: string, type: string) => {
    if (subscription === ESubcription.Free && type === "writing") {
      setOpenSubscriptionDialog(true);
      return;
    }
    nav(`${Route.ExamIntruction}/${type}/${id}`)
  };
  return (
    <div className="flex h-full p-8 gap-14 w-11/12">
      <DialogUpgrade
        openSubscriptionDialog={openSubscriptionDialog}
        setOpenSubscriptionDialog={setOpenSubscriptionDialog}
      />
      <div className="w-64 border bg-white rounded-lg p-6">
        <div className="space-y-6">
          <section>
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
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Year</h3>
            <div className="space-y-2">
              <RadioGroup
                value={params.year || ""}
                onValueChange={(value) => {
                  setParams((prev) => ({
                    ...prev,
                    year: value,
                  }));
                }}
              >
                {yearString?.map((year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <RadioGroupItem value={year} id={year} />
                    <Label htmlFor={year}>{year}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </section>
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
            {examTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="w-full hover:text-[#164C7E]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {examTabs.map((tab) => (
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
                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-md text-sm">
                          {formatMillisecondsToMMSS(card.time)}
                        </div>
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
                          onClick={() => handleStartExam(card.id, card.type)}
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
