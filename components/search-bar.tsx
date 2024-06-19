"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Loader2, SearchIcon } from "lucide-react"

const formSchema = z.object({
  query: z.string().min(0).max(200),
})

interface SearchBarProps {
  query: string,
  setQuery: Dispatch<SetStateAction<string>>;
}

export const SearchBar = ({
  query,
  setQuery,
}: SearchBarProps) => {
  const [input, setInput] = useState("")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query
    }
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(input)
    setInput("")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="h-full flex items-center"
    >
      <Input
        disabled={form.formState.isSubmitting}
        value={input}
        onChange={handleInputChange}
        placeholder="search"
        className="h-9"
      />
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        disabled={form.formState.isSubmitting}
        className="flex gap-1"
      >
        {form.formState.isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <SearchIcon />
      </Button>
    </form>
  )
}