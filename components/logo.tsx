import Image from "next/image"
import Link from "next/link"
import { SiMicrosoftacademic } from "react-icons/si";


export const Logo = ({
  imageOnly
}: {
  imageOnly: boolean
}) => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-2 text-primary/80">
        <SiMicrosoftacademic className="h-6 w-6" />
        {!imageOnly && (
          <p className="text-xl font-bold">
            Knowtate
          </p>
        )}
      </div>
    </Link>
  )
}