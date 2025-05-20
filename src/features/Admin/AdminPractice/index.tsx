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
import { useEffect, useState } from "react";
import { IRequestExcercise, TypeExcercise } from "@/types/excercise";
import { practiceTabs } from "@/constant/filter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import { Route } from "@/constant/route";
import { useGetFullPractice } from "./hooks/useGetFullPractices";
import DialogDeletePractice from "./components/DialogDeletePractice";
const AdminPractice = () => {
  const nav = useNavigate();
  const [idPractice, setIdPractice] = useState("");
  const [openDeletePractice, setOpenDeletePractice] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<IRequestExcercise>(() => {
    return {
      type: (searchParams.get("type") as TypeExcercise) ?? "reading",
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
    };
  });
  const { data, refetch } = useGetFullPractice(params);
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (params.type) newSearchParams.set("type", params.type);
    if (params.page != undefined)
      newSearchParams.set("page", params.page.toString());
    setSearchParams(newSearchParams);
  }, [params, setSearchParams]);
  useEffect(() => {
    refetch();
  }, [params]);
  const handleDelete = (id: string) => {
    setOpenDeletePractice(true);
    setIdPractice(id);
  };
  return (
    <div className="h-full p-8 gap-14 w-11/12">
      <DialogDeletePractice
        openDeletePractice={openDeletePractice}
        id={idPractice}
        setOpenDeletePractice={setOpenDeletePractice}
        refetch={refetch}
      />
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center justify-end w-full mb-4">
          <Button
            className="border-2 flex gap-3 border-[#164C7E] font-bold bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
            onClick={() => {
              nav(Route.CreatePractice);
            }}
          >
            <FilePlus2 />
            Add Practice
          </Button>
        </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
                      <CardFooter className="flex flex-col items-center gap-2 px-3">
                        <p
                          className="text-sm text-center line-clamp-1"
                          title={card.name}
                        >
                          {card.name}
                        </p>
                        <div className="flex gap-1 items-center justify-between w-full">
                          <button
                            className="w-1/2 px-1 py-1 bg-transparent rounded-lg text-xs hover:bg-red-500 hover:text-white font-semibold border-red-500 border-2 text-red-500"
                            onClick={() => handleDelete(card.id)}
                          >
                            Delete Practice
                          </button>
                          <button
                            className="w-1/2 px-2 py-1 bg-transparent rounded-lg text-xs hover:bg-blue-500 hover:text-white font-semibold border-blue-500 border-2 text-blue-500"
                            onClick={() => {
                              nav(`${Route.EditPractice}/${card.id}`);
                            }}
                          >
                            Edit Practice
                          </button>
                        </div>
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
};

export default AdminPractice;
