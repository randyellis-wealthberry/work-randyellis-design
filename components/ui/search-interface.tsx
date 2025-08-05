"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  category?: string;
  tags?: string[];
}

interface SearchInterfaceProps {
  placeholder?: string;
  className?: string;
}

export function SearchInterface({
  placeholder = "Search projects, articles, and more...",
  className = "",
}: SearchInterfaceProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock search function - in production, this would call your search API
  const performSearch = async (
    searchQuery: string,
  ): Promise<SearchResult[]> => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock results - replace with actual search implementation
    const mockResults: SearchResult[] = [
      {
        id: "ledgeriq",
        title: "LedgerIQ",
        description:
          "AI-Powered Payroll Fraud Detection Platform - 78% error reduction",
        type: "project",
        url: "/projects/ledgeriq",
        category: "Enterprise (SaaS)",
        tags: ["AI", "Machine Learning", "Fraud Detection"],
      },
      {
        id: "growit",
        title: "GrowIt!",
        description: "Social Gardening Platform with 1M+ users globally",
        type: "project",
        url: "/projects/growit",
        category: "Mobile App",
        tags: ["Social Platform", "React Native", "Community"],
      },
      {
        id: "blog-ai-guide",
        title: "AI Design Guide",
        description: "Complete guide to AI-powered design systems",
        type: "blog",
        url: "/blog/ai-design-guide",
      },
    ].filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );

    setIsLoading(false);
    return mockResults;
  };

  useEffect(() => {
    const searchResults = async () => {
      if (query.length >= 2) {
        const searchResults = await performSearch(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    };

    const debounce = setTimeout(searchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return "💼";
      case "blog":
        return "📝";
      case "page":
        return "📄";
      default:
        return "🔍";
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-10 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-blue-400"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query.length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2"
          >
            <Card className="max-h-96 overflow-y-auto shadow-lg border border-zinc-200 dark:border-zinc-700">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-zinc-500 mt-2">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      onClick={() => setIsOpen(false)}
                      className="block p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">
                          {getTypeIcon(result.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {result.title}
                            </h4>
                            {result.category && (
                              <Badge variant="outline" className="text-xs">
                                {result.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                            {result.description}
                          </p>
                          {result.tags && (
                            <div className="flex gap-1 mt-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-zinc-500">
                    No results found for &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Try adjusting your search terms
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-zinc-500">
                    Start typing to search...
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
