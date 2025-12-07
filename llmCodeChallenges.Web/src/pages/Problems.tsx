import Header from "../components/Header";
import { Link } from "react-router-dom";
import { mockProblems } from "../mock";
import { useState, useMemo, useRef, useEffect } from "react";

export function Problems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const tagDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get unique languages and tags
  const languages = useMemo(() => {
    return Array.from(new Set(mockProblems.map((p) => p.language)));
  }, []);

  const allTags = useMemo(() => {
    return Array.from(new Set(mockProblems.flatMap((p) => p.tags)));
  }, []);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return mockProblems.filter((problem) => {
      const matchesSearch =
        searchQuery === "" ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLanguage = !selectedLanguage || problem.language === selectedLanguage;

      const matchesTag = !selectedTag || problem.tags.includes(selectedTag);

      return matchesSearch && matchesLanguage && matchesTag;
    });
  }, [searchQuery, selectedLanguage, selectedTag]);

  // Create a filter key to track when filters change
  const filterKey = `${searchQuery}-${selectedLanguage}-${selectedTag}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);

  // Reset page when filters change
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  return (
    <>
      <div
        className="relative flex h-auto min-h-screen w-full flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
        style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                    Explore Challenges
                  </p>
                  <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                    Browse and filter challenges to find the perfect one for you.
                  </p>
                  {(searchQuery || selectedLanguage || selectedTag) && (
                    <p className="text-[#9dabb9] text-sm">
                      Showing {filteredProblems.length} of {mockProblems.length} challenges
                    </p>
                  )}
                </div>
              </div>
              <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                    <div
                      className="text-[#9dabb9] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-lg border-r-0"
                      data-icon="MagnifyingGlass"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                      </svg>
                    </div>
                    <input
                      placeholder="Search by title or description..."
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#283039] focus:border-none h-full placeholder:text-[#9dabb9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </label>
              </div>
              <div className="flex gap-3 p-3 flex-wrap pr-4">
                <div className="relative" ref={languageDropdownRef}>
                  <button
                    onClick={() => {
                      setShowLanguageDropdown(!showLanguageDropdown);
                      setShowTagDropdown(false);
                    }}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 hover:bg-[#354353] transition-colors ${
                      selectedLanguage ? "bg-[#1380ec] text-white" : "bg-[#283039] text-white"
                    }`}
                  >
                    <p className="text-white text-sm font-medium leading-normal">
                      {selectedLanguage || "Language"}
                    </p>
                    <div
                      className="text-white"
                      data-icon="CaretDown"
                      data-size="20px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                  </button>
                  {showLanguageDropdown && (
                    <div className="absolute top-full mt-2 z-10 bg-[#283039] rounded-lg shadow-lg border border-[#3b4754] min-w-[150px]">
                      <button
                        onClick={() => {
                          setSelectedLanguage(null);
                          setShowLanguageDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#354353] transition-colors first:rounded-t-lg"
                      >
                        All Languages
                      </button>
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setSelectedLanguage(lang);
                            setShowLanguageDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#354353] transition-colors last:rounded-b-lg"
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative" ref={tagDropdownRef}>
                  <button
                    onClick={() => {
                      setShowTagDropdown(!showTagDropdown);
                      setShowLanguageDropdown(false);
                    }}
                    className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-2 hover:bg-[#354353] transition-colors ${
                      selectedTag ? "bg-[#1380ec] text-white" : "bg-[#283039] text-white"
                    }`}
                  >
                    <p className="text-white text-sm font-medium leading-normal">
                      {selectedTag || "Tags"}
                    </p>
                    <div
                      className="text-white"
                      data-icon="CaretDown"
                      data-size="20px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20px"
                        height="20px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                      </svg>
                    </div>
                  </button>
                  {showTagDropdown && (
                    <div className="absolute top-full mt-2 z-10 bg-[#283039] rounded-lg shadow-lg border border-[#3b4754] min-w-[150px] max-h-[300px] overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedTag(null);
                          setShowTagDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#354353] transition-colors first:rounded-t-lg"
                      >
                        All Tags
                      </button>
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTag(tag);
                            setShowTagDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#354353] transition-colors last:rounded-b-lg"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {filteredProblems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[#9dabb9] text-lg">
                    No challenges found matching your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLanguage(null);
                      setSelectedTag(null);
                    }}
                    className="mt-4 text-[#1380ec] hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                currentProblems.map((problem) => (
                  <div key={problem.id} className="p-4">
                    <Link
                      to={`/challenge/${problem.id}`}
                      className="flex items-stretch justify-between gap-4 rounded-lg p-4 bg-[#1c2127] hover:bg-[#283039] transition-colors cursor-pointer border border-[#283039]"
                    >
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-1">
                          <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                            {problem.language}
                          </p>
                          <p className="text-white text-base font-bold leading-tight">
                            {problem.title}
                          </p>
                          <p className="text-[#9dabb9] text-sm font-normal leading-normal">
                            {problem.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded bg-[#283039] text-[#9dabb9]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
              {filteredProblems.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center p-4 gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex size-10 items-center justify-center hover:bg-[#283039] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-white"
                    >
                      <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`text-sm font-medium leading-normal flex size-10 items-center justify-center rounded-full transition-colors ${
                          currentPage === pageNum
                            ? "bg-[#283039] text-white font-bold"
                            : "text-white hover:bg-[#1c2127]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex size-10 items-center justify-center hover:bg-[#283039] rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                      className="text-white"
                    >
                      <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problems;
