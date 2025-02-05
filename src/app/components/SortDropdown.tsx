"use client"

type SortOption = "newest" | "oldest" | "title"

interface SortDropdownProps {
 onSort: (option: SortOption) => void
 currentSort: SortOption
}

export default function SortDropdown({ onSort, currentSort }: SortDropdownProps) {
 return (
   <select
     value={currentSort}
     onChange={(e) => onSort(e.target.value as SortOption)}
     className="h-12 px-4 pr-8 border rounded text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
     style={{
       backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
       backgroundRepeat: "no-repeat",
       backgroundPosition: "right 0.5rem center",
       backgroundSize: "1em"
     }}
   >
     <option value="newest">Newest First</option>
     <option value="oldest">Oldest First</option>
     <option value="title">By Title</option>
   </select>
 )
}
