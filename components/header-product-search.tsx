"use client";

import Link from "next/link";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type HeaderSearchProduct = {
  id: string;
  name: string;
};

type HeaderProductSearchProps = {
  products: HeaderSearchProduct[];
  className?: string;
  placeholder?: string;
  inputClassName?: string;
  maxResults?: number;
};

export function HeaderProductSearch({
  products,
  className,
  placeholder = "Search products...",
  inputClassName,
  maxResults = 6,
}: HeaderProductSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const listboxId = `${inputId}-listbox`;

  const normalizedQuery = query.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return products
      .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      .slice(0, maxResults);
  }, [maxResults, normalizedQuery, products]);

  const showDropdown = isFocused && normalizedQuery.length > 0;
  const hasResults = suggestions.length > 0;

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsFocused(false);
      event.currentTarget.blur();
    }
  };

  return (
    <div
      className={cn("relative", className)}
      role="combobox"
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      aria-controls={listboxId}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "h-11 w-full rounded-full border border-white/15 bg-black/35 pl-10 pr-4 text-sm text-text-primary shadow-[0_6px_20px_rgba(0,0,0,0.28)] outline-none transition-colors placeholder:text-text-secondary focus-visible:border-accent-gold",
            inputClassName
          )}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-label="Search products"
        />
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-[70] overflow-hidden rounded-2xl border border-white/15 bg-[#0b0b0b]/95 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {hasResults ? (
            <ul id={listboxId} className="max-h-80 overflow-y-auto py-2" role="listbox" aria-label="Product suggestions">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/favorites/${product.id}`}
                    className="block px-4 py-2.5 text-sm text-text-primary transition-colors hover:bg-white/8 hover:text-accent-gold"
                    onClick={() => {
                      setQuery("");
                      setIsFocused(false);
                    }}
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-text-secondary">
              No products found for <span className="text-text-primary">&quot;{query.trim()}&quot;</span>.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
