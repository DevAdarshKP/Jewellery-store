'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export function CollectionSortDropdown({ currentSort = 'newest' }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (newSort === 'newest') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    params.delete('page');
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="relative inline-flex items-center space-x-1.5 text-xs text-[#555] font-light">
      <span>Sort by</span>
      <div className="relative inline-flex items-center">
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="appearance-none bg-transparent pr-4 pl-1 py-1 text-xs text-[#171316] font-normal cursor-pointer focus:outline-none border-b border-transparent hover:border-[#171316] transition-colors"
          aria-label="Sort collection by"
        >
          <option value="newest">Newest</option>
          <option value="title_asc">Name: A – Z</option>
          <option value="title_desc">Name: Z – A</option>
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-[#555] pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

