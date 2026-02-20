"use client";

import { FuseResult } from "fuse.js";
import FlashcardDisplay from "@/components/explore/flashcard-display";
import Search from "@/components/explore/search";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPublicSets } from "@/actions/flashcard-set-actions";
import { FlashcardSet } from "@/types/flashcard-set";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useUserSession from "@/hooks/use-user-session";
import { getUserById } from "@/actions/login-actions";
import { FilterIcon, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Explore = () => {
  const userSession = useUserSession();

  const { data: user } = useQuery({
    queryKey: ["user", "user_id"],
    queryFn: () => getUserById(userSession?.uid),
    enabled: !!userSession,
  });

  const { data: allSets } = useQuery({
    queryKey: [],
    queryFn: () => getAllPublicSets(),
  });

  const [searchResults, setSearchResults] = useState<
    FuseResult<FlashcardSet>[]
  >([]);
  const [isFavorites, setIsFavorites] = useState(false);

  const handleSearchResults = (results: FuseResult<FlashcardSet>[]) => {
    setSearchResults(results);
  };

  // Define options for the dropdown menu
  const dropdownOptions = [
    ...new Set(allSets?.flatMap((set) => set.tags).filter((tag) => tag) || []),
  ];

  // State to manage selected options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Function to handle selection of dropdown options
  const handleDropdownSelection = (option: string) => {
    // Toggle the selected status of the option
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  const clearSelectedOptions = () => {
    setSelectedOptions([]);
  };

  let visibleSets = allSets?.sort((a, b) => b.likes - a.likes) || [];

  if (searchResults.length > 0) {
    visibleSets = searchResults.map((result) => result.item);
  }

  if (selectedOptions.length !== 0) {
    visibleSets = visibleSets.filter((set) =>
      set.tags?.some((tag) => selectedOptions.includes(tag)),
    );
  }

  const userFavoriteSetIds = user?.favourites;

  if (isFavorites) {
    // Display user's favorite sets if favorites mode is enabled
    visibleSets = visibleSets.filter((set) =>
      userFavoriteSetIds?.includes(set.id),
    );
  }

  return (
    <main className="mt-16">
      <h1 className="text-4xl font-bold text-center mb-8">
        Explore flashcards
      </h1>
      {/* Searchbar with filter and sort button */}
      <div className="flex flex-row justify-center mb-12 w-full">
        <Search onSearchResults={handleSearchResults} />

        <Button
          onClick={() => {
            setIsFavorites(!isFavorites);
          }}
          className={`h-12 border-[1px] ${isFavorites ? "bg-[--clr_primary]" : "bg-[#17263a]"}`}
        >
          Favorites
          <Star
            className="ml-2"
            size={20}
            fill="#e8f0ff"
            fillOpacity={isFavorites ? 1 : 0}
          />
        </Button>
        <div className="relative ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-12">
                Filter
                <FilterIcon className="ml-2" size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {selectedOptions.length > 0 && (
                <>
                  <DropdownMenuItem
                    className="px-4 py-2 text-sm cursor-pointer text-gray-500 hover:text-gray-700"
                    onClick={clearSelectedOptions}
                  >
                    Clear filters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {dropdownOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => handleDropdownSelection(option)}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <div className="flex flex-row flex-wrap justify-center gap-6 mb-20">
          {visibleSets.map((set) => (
            <Link href={`/sets/${set.id}`} key={set.id}>
              <FlashcardDisplay
                subject={set.name}
                creator={set.createdBy}
              ></FlashcardDisplay>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Explore;
