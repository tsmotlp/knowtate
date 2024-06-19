"use client"

import { Logo } from "./logo"

export const Navbar = () => {

  return (
    <div className="z-50 border-b fixed top-0 flex items-center w-full h-12 py-2 px-6">
      <Logo imageOnly={false} />
    </div>
  )
}