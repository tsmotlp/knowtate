"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Dropzone from "react-dropzone"
import { FileIcon, Loader2, Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Paper } from "@prisma/client"
import { DashboardItem, DashboardItemType } from "@/types/types"
// import { useMutation, useQuery } from "convex/react"
// import { api } from "@/convex/_generated/api"


const formSchema = z.object({
  title: z.string().min(1, { message: "title is required" }).max(200),
  paper: z.custom<File>((val) => val instanceof File, "paper is required"),
})

interface PaperUploaderProps {
  setItems: Dispatch<SetStateAction<DashboardItem[]>>
  categoryId: string
}

export const PaperUploader = ({
  categoryId,
  setItems
}: PaperUploaderProps) => {
  const [isPaperDialogOpen, setIsPaperDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      paper: undefined
    }
  })

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((preProgress) => {
        if (preProgress >= 95) {
          clearInterval(interval);
          return preProgress;
        }
        return preProgress + 5;
      });
    }, 500);
    return interval;
  };

  const onSubmit = async () => {
    setIsUploading(true)
    const progressInterval = startSimulatedProgress();
    const formData = new FormData()
    const paperData = form.getValues()
    formData.append("paper", paperData.paper);
    formData.append("title", paperData.title);
    if (categoryId && categoryId !== "recents") {
      formData.append("categoryId", categoryId)
    } else {
      formData.append("categoryId", "library")
    }
    const response = await axios.post("/api/paper", formData);
    if (!response || response.status !== 200) {
      return toast("Failed to upload paper", {
        description: "Please try again later",
      });
    }
    const paperInfo: Paper = response.data;
    if (!paperInfo) {
      return toast("Failed to upload paper", {
        description: "Please try again later",
      });
    }
    setItems((current) => [...current, {
      id: paperInfo.id,
      label: paperInfo.title,
      type: DashboardItemType.Paper,
      archived: paperInfo.archived,
      favorited: paperInfo.favorited,
      url: paperInfo.url,
      authors: paperInfo.authors,
      publication: paperInfo.publication,
      publicationDate: paperInfo.publicateDate,
      paperTile: null,
      paperId: null,
      lastEdit: paperInfo.updatedAt,
    }])
    clearInterval(progressInterval);
    setUploadProgress(100);
    setIsPaperDialogOpen(false)
  }

  return (
    <Dialog
      open={isPaperDialogOpen}
      onOpenChange={(isOpen) => {
        setIsPaperDialogOpen(isOpen)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
        >
          <Upload className="h-4 w-4 mr-1" />
          上传文献
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2 text-center">Upload Your Paper Here</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Use the default title or type to rename the paper</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paper"
                render={() => (
                  <Dropzone
                    noClick
                    multiple={false}
                    onDropAccepted={(acceptedFiles) => {
                      if (acceptedFiles && acceptedFiles.length > 0) {
                        form.setValue("paper", acceptedFiles[0])
                        if (form.getValues().title === "") {
                          form.setValue("title", acceptedFiles[0].name)
                        }
                      }
                    }}
                  >
                    {({ getRootProps, getInputProps, acceptedFiles }) => (
                      <div
                        {...getRootProps()}
                        className="border h-64 border-dashed rounded-lg"
                      >
                        <div className="flex items-center justify-center h-full w-full">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {/* <Cloud className="h-6 w-6 mb-2" /> */}
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.3591 4.59684L14.9334 4.85914L15.1246 5.16935L15.4784 5.08239L15.3591 4.59684ZM18.5919 15.5C18.3157 15.5 18.0919 15.7239 18.0919 16C18.0919 16.2761 18.3157 16.5 18.5919 16.5V15.5ZM19.5563 6.88799C19.2819 6.85691 19.0343 7.05416 19.0032 7.32855C18.9721 7.60294 19.1693 7.85056 19.4437 7.88164L19.5563 6.88799ZM6.62696 16.4811C6.9031 16.4811 7.12696 16.2572 7.12696 15.9811C7.12696 15.7049 6.9031 15.4811 6.62696 15.4811V16.4811ZM19.5056 7.45946C19.547 7.73249 19.8018 7.92032 20.0748 7.87898C20.3479 7.83765 20.5357 7.5828 20.4944 7.30977L19.5056 7.45946ZM19.9171 7L19.4358 7.13537V7.13537L19.9171 7ZM5.00734 6.83343L4.50811 6.80568L4.50811 6.80568L5.00734 6.83343ZM4.5 7.0982C4.5 7.37434 4.72386 7.5982 5 7.5982C5.27614 7.5982 5.5 7.37434 5.5 7.0982H4.5ZM3.55831 8.42623C3.79371 8.28186 3.86751 7.974 3.72314 7.7386C3.57878 7.5032 3.27092 7.4294 3.03552 7.57377L3.55831 8.42623ZM14.6356 16.2874C14.8247 16.4886 15.1412 16.4984 15.3424 16.3093C15.5436 16.1202 15.5535 15.8038 15.3644 15.6026L14.6356 16.2874ZM12.2034 12.0481L11.7571 12.2734V12.2734L12.2034 12.0481ZM11.9937 12.0506L12.4463 12.2631L12.4463 12.2631L11.9937 12.0506ZM8.65641 15.5817C8.45579 15.7715 8.447 16.0879 8.63676 16.2886C8.82652 16.4892 9.14298 16.498 9.34359 16.3082L8.65641 15.5817ZM12.533 12.4639C12.5437 12.1879 12.3287 11.9556 12.0528 11.9448C11.7768 11.9341 11.5444 12.1491 11.5337 12.425L12.533 12.4639ZM12.1906 22.2132C12.3083 22.463 12.6063 22.57 12.8561 22.4523C13.1058 22.3345 13.2129 22.0366 13.0951 21.7868L12.1906 22.2132ZM16.3743 3.96318C15.9706 3.96318 15.5768 4.02845 15.2398 4.11128L15.4784 5.08239C15.763 5.01246 16.0736 4.96318 16.3743 4.96318V3.96318ZM15.7848 4.33454C14.7382 2.63605 12.7722 1.5 10.5318 1.5V2.5C12.4349 2.5 14.074 3.46433 14.9334 4.85914L15.7848 4.33454ZM18.5919 16.5C21.272 16.5 23.5 14.472 23.5 11.8911H22.5C22.5 13.8547 20.7871 15.5 18.5919 15.5V16.5ZM23.5 11.8911C23.5 9.63145 22.0681 7.17244 19.5563 6.88799L19.4437 7.88164C21.2791 8.08949 22.5 9.94727 22.5 11.8911H23.5ZM0.5 11.8722C0.5 14.4531 2.728 16.4811 5.40813 16.4811V15.4811C3.21291 15.4811 1.5 13.8357 1.5 11.8722H0.5ZM5.40813 16.4811H6.62696V15.4811H5.40813V16.4811ZM20.4944 7.30977C20.4715 7.15851 20.4393 7.00994 20.3984 6.86463L19.4358 7.13537C19.4656 7.24126 19.489 7.34941 19.5056 7.45946L20.4944 7.30977ZM20.3984 6.86463C19.9252 5.18183 18.2995 3.96318 16.3743 3.96318V4.96318C17.8817 4.96318 19.0918 5.91221 19.4358 7.13537L20.3984 6.86463ZM10.5318 1.5C7.33051 1.5 4.67387 3.82383 4.50811 6.80568L5.50657 6.86118C5.6393 4.47347 7.79442 2.5 10.5318 2.5V1.5ZM4.50811 6.80568C4.50272 6.90261 4.5 7.00014 4.5 7.0982H5.5C5.5 7.01867 5.50221 6.93965 5.50657 6.86118L4.50811 6.80568ZM3.03552 7.57377C2.16943 8.10492 1.52856 8.72442 1.10693 9.45296C0.684318 10.1832 0.5 10.9919 0.5 11.8722H1.5C1.5 11.1364 1.65244 10.5068 1.97244 9.95386C2.29341 9.39923 2.80099 8.89068 3.55831 8.42623L3.03552 7.57377ZM15.3644 15.6026C14.7632 14.9628 13.4186 13.3461 12.6498 11.8228L11.7571 12.2734C12.5873 13.9182 14.0039 15.6151 14.6356 16.2874L15.3644 15.6026ZM11.5411 11.8381C11.3289 12.29 10.8758 12.9752 10.3265 13.6885C9.78141 14.3964 9.1684 15.0974 8.65641 15.5817L9.34359 16.3082C9.90522 15.777 10.5533 15.033 11.1188 14.2986C11.68 13.5698 12.1869 12.8156 12.4463 12.2631L11.5411 11.8381ZM12.6498 11.8228C12.5731 11.6708 12.4484 11.5905 12.357 11.5515C12.264 11.512 12.1711 11.4991 12.0915 11.5001C12.0119 11.5011 11.9193 11.5163 11.8275 11.5582C11.7372 11.5994 11.6139 11.6831 11.5411 11.8381L12.4463 12.2631C12.389 12.3851 12.2955 12.4438 12.2423 12.4681C12.1875 12.4931 12.1392 12.4995 12.1041 12.5C12.0689 12.5004 12.0205 12.4952 11.9652 12.4716C11.9113 12.4487 11.8173 12.3927 11.7571 12.2734L12.6498 11.8228ZM11.5337 12.425C11.4866 13.6375 11.424 15.5863 11.4816 17.4636C11.5104 18.402 11.5694 19.331 11.6771 20.1459C11.7833 20.9494 11.9421 21.686 12.1906 22.2132L13.0951 21.7868C12.9151 21.4049 12.7716 20.7951 12.6685 20.0148C12.5668 19.2459 12.5094 18.3536 12.4811 17.433C12.4247 15.5923 12.486 13.6725 12.533 12.4639L11.5337 12.425Z" fill="black" />
                              </svg>
                              <p className="mt-2 mb-2 text-sm">
                                <span className="font-semibold">Click to choose</span> or drag
                                and drop a paper
                              </p>
                              <p className="text-xs">(only support PDF file currently)</p>
                            </div>
                            {acceptedFiles && acceptedFiles[0] && (
                              <div className="max-w-xs flex items-center rounded-md overflow-hidden outline outline-[1px] divide-x">
                                <div className="px-3 py-2 h-full grid place-items-center">
                                  <FileIcon className="h-4 w-4" />
                                </div>
                                <div className="px-3 py-2 h-full text-sm truncate">
                                  {acceptedFiles[0].name}
                                </div>
                              </div>
                            )}
                            <input
                              {...getInputProps()}
                              type="file"
                              accept=".pdf"
                              id="dropzone-file"
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                )}
              />
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-1 w-full" />
                </div>
              ) : (
                <div className="flex w-full items-center justify-center gap-x-2">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    variant="secondary"
                    size="sm"
                  >
                    上传
                  </Button>
                  <Button
                    onClick={() => { setIsPaperDialogOpen(false) }}
                    variant="secondary"
                    size="sm"
                  >
                    取消
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>

    </Dialog>
  )
}