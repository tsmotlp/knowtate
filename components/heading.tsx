"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Welcome to <span className="underline">Knowtate</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Embrace the power of centralized document management, seamless reading, and intelligent QA with AI.
      </h3>
      <Button asChild>
        <Link href="/dashboard/library">
          Enter Knowtate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}