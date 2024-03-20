"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusCircle,
  TrashIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const CategoryActions = () => {
  const [categoryName, setCategoryName] = useState("")
  const [categoryId, setCategoryId] = useState<Id<"categories"> | "All">("All");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const createCategory = useMutation(api.categories.createCategory)
  const deleteCategory = useMutation(api.categories.deleteCategory)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value)
  }
  const categories = useQuery(api.categories.getCategories)

  return (
    <>
      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(isOpen) => {
          setIsCreateDialogOpen(isOpen)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new category</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Artifical Intelligence"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                const promise = createCategory({ name: categoryName })
                toast.promise(promise, {
                  loading: "Category creating...",
                  success: "Category created!",
                  error: "Failed to create category!"
                })
                setIsCreateDialogOpen(false)
                setCategoryName("")
              }}
            >Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDeleteDialogOpen(isOpen)
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select the category you want to delete</DialogTitle>
          </DialogHeader>
          <Select
            value={categoryId}
            onValueChange={(newcategoryId) => {
              setCategoryId(newcategoryId as any);
            }}
          >
            <SelectTrigger id="type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories && categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogDescription><p className="text-red-600">CAUTION! The papers belong to the category will be also deleted!</p></DialogDescription>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                if (categoryId !== "All") {
                  const promise = deleteCategory({ categoryId: categoryId })
                  toast.promise(promise, {
                    loading: "Category deleting...",
                    success: "Category deleted!",
                    error: "Failed to delete category!"
                  })
                }
                setIsDeleteDialogOpen(false)
              }}
              variant="destructive"
            >Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
          >
            Categories
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsCreateDialogOpen(true);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <div className="flex gap-2 text-green-600 items-center cursor-pointer">
              <PlusCircle className="w-4 h-4" /> Create
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsDeleteDialogOpen(true);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <div className="flex gap-2 text-red-600 items-center cursor-pointer">
              <TrashIcon className="w-4 h-4" /> Delete
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}