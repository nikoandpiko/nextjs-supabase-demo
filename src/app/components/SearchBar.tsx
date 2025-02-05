"use client"

import { useState } from "react"

export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
 const [term, setTerm] = useState("")

 return (
   <div className="mb-8">
     <input
       type="text"
       placeholder="Search posts by title or content..."
       value={term}
       onChange={(e) => {
         setTerm(e.target.value)
         onSearch(e.target.value)
       }}
       className="w-full p-3 border rounded text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
     />
   </div>
 )
}
