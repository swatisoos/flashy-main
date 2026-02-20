"use client";

import { Input } from "@/components/ui/input";
import Fuse, { FuseResult } from "fuse.js";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlashcardSet } from "@/types/flashcard-set";
import { getAllPublicSets } from "@/actions/flashcard-set-actions";

interface SearchProps {
  onSearchResults: (results: FuseResult<FlashcardSet>[]) => void;
}

const Search = ({ onSearchResults }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [flashcardContent, setflashcardContent] = useState<FlashcardSet[]>([]);
  const [fuse, setFuse] = useState<Fuse<FlashcardSet>>(
    new Fuse([], { keys: ["name", "createdBy"] }),
  );

  const {
    data: allSets,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [],
    queryFn: () => getAllPublicSets(),
  });

  // const sortedData = allSets?.sort((a,b) => a.likedBy - b.likedBy);

  // Sets flashcardContent once when page is
  useEffect(() => {
    const setArray: FlashcardSet[] = [];
    allSets?.map((set) => setArray.push(set));
    setflashcardContent(setArray);
  }, [allSets]);

  // useEffect(() => {
  //   const setArray: FlashcardSet[] = [];
  //   sortedData?.map((set) => setArray.push(set));
  //   setflashcardContent(setArray);
  // }, [sortedData]);

  // Function is called when searchfield changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuery(value);
    if (fuse) {
      const searchResults = fuse.search(value);
      const testResults = fuse.search("test");
      onSearchResults(searchResults);
    }
  };

  useEffect(() => {
    setFuse(
      new Fuse(flashcardContent, {
        keys: ["name", "createdBy"],
        includeScore: true,
        threshold: 0.4, // Sets a threshold for how strict the search should be
        isCaseSensitive: false,
      }),
    );
  }, [flashcardContent]);

  return (
    <Input
      type="text"
      placeholder="Search for sets..."
      className="w-1/2 h-12 mr-5 bg-card text-white"
      onChange={handleSearch}
      value={query}
    />
  );
};

export default Search;
