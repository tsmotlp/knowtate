import Image from "next/image"
import Link from "next/link"

export const Logo = ({
  imageOnly
}: {
  imageOnly: boolean
}) => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-3">
        <Image
          src="/logo.svg"
          height="40"
          width="40"
          alt="logo"
          className="dark:hidden"
        />
        <Image
          src="/logo-dark.svg"
          height="40"
          width="40"
          alt="logo"
          className="hidden dark:block"
        />
        {!imageOnly && (
          <p className="text-2xl font-extrabold">
            Knowtate
          </p>
        )}
      </div>
    </Link>
  )
}