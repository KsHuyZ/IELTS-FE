import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DialogVocabTopic } from "./components/DialogVocabTopic";
import { DialogGrammarSelect } from "./components/DialogGrammarSelect";
import { useGetBlogByTopic } from "./hooks/useGetBlogByTopic";
import { useGetBlogByGrammar } from "./hooks/useGetBlogByGrammar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Route } from "@/constant/route";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LearnWithDialog() {
  const nav = useNavigate();
  const [selectedVocabTopic, setSelectedVocabTopic] = useState<
    string | undefined
  >(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState(() => {
    return {
      pageTopic: Number(searchParams.get("pageTopic")) || 1,
      pageGrammar: Number(searchParams.get("pageGrammar")) || 1,
    };
  });
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    if (params.pageTopic != undefined)
      newSearchParams.set("pageTopic", params.pageTopic.toString());
    if (params.pageGrammar != undefined)
      newSearchParams.set("pageGrammar", params.pageGrammar.toString());
    setSearchParams(newSearchParams);
  }, [params, setSearchParams]);
  const [selectedGrammarTense, setSelectedGrammarTense] = useState<
    string | undefined
  >(undefined);
  const { data, refetch } = useGetBlogByTopic({
    topicId: selectedVocabTopic,
    page: params.pageTopic,
  });

  const { data: grammar, refetch: refetchGrammar } = useGetBlogByGrammar({
    grammarPointId: selectedGrammarTense,
    page: params.pageGrammar,
  });
  useEffect(() => {
    refetch();
  }, [selectedVocabTopic, params.pageTopic]);
  useEffect(() => {
    refetchGrammar();
  }, [selectedGrammarTense, params.pageGrammar]);

  return (
    <div className="p-6 space-y-8">
      {/* Vocabulary Topics Section */}
      <div className="flex justify-between items-center gap-10">
        <div className="w-full bg-white p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">VOCABULARY BY TOPIC</h2>
            <DialogVocabTopic
              onTopicSelect={setSelectedVocabTopic}
              selectedTopic={selectedVocabTopic}
              buttonLabel="Select Vocabulary Topic"
            />
          </div>
          {data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {data?.data?.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <CardContent className="p-0 relative">
                    <img
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="w-full h-24 object-cover"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-center gap-2 p-4">
                    <div className="h-12">
                      <p
                        className="text-sm text-center line-clamp-1"
                        title={card.title}
                      >
                        {card.title}
                      </p>
                    </div>
                    <Button
                      className="border-2 border-[#164C7E] bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
                      onClick={() => {
                        nav(`${Route.LearnLesson}/${card.id}`);
                      }}
                    >
                      START
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No lessons found for this topic.
              </p>
            </div>
          )}
          {(data?.pages || 0) > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        setParams((prev) => ({
                          ...prev,
                          pageTopic: (data?.page ?? 1) - 1,
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
                          pageTopic: page,
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
                          pageTopic: (data?.page ?? 1) + 1,
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

      {/* Grammar Tenses Section */}
      <div className="p-6 bg-white rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">GRAMMAR TENSES</h2>
          <DialogGrammarSelect
            onTenseSelect={setSelectedGrammarTense}
            selectedTense={selectedGrammarTense}
          />
        </div>
        {grammar?.data && grammar.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {grammar.data.map((card, index) => (
              <Card key={card.id || index} className="overflow-hidden">
                <CardContent className="p-0 relative">
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.title}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </CardContent>
                <CardFooter className="flex flex-col justify-between items-center p-3 gap-3">
                  <div className="h-12">
                    <p
                      className="font-medium text-center flex-1 line-clamp-1"
                      title={card.title}
                    >
                      {card.title}
                    </p>
                  </div>
                  <Button
                    className="border-2 border-[#164C7E] bg-white text-[#164C7E] hover:text-white hover:bg-[#164C7E]"
                    onClick={() => {
                      nav(`${Route.LearnLesson}/${card.id}`);
                    }}
                  >
                    START
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No grammar lessons found for this tense.
            </p>
          </div>
        )}
        {(grammar?.pages || 0) > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        pageGrammar: (grammar?.page ?? 1) - 1,
                      }));
                    }}
                    className={
                      grammar?.page === 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
                {Array.from(
                  { length: grammar?.pages ?? 1 },
                  (_, index) => index + 1
                ).map((page) => (
                  <PaginationItem
                    key={page}
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        pageGrammar: page,
                      }));
                    }}
                  >
                    <PaginationLink isActive={page === grammar?.page}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      setParams((prev) => ({
                        ...prev,
                        pageGrammar: (grammar?.page ?? 1) + 1,
                      }));
                    }}
                    className={
                      grammar?.page === grammar?.pages
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
