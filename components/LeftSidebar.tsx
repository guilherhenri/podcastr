'use client'

import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

export function LeftSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <section className="left_sidebar">
      <nav className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex cursor-pointer gap-1 pb-10 max-lg:justify-center"
        >
          <Image src="/icons/logo.svg" alt="logo" width={23} height={27} />
          <h1 className="text-24 text-white font-extrabold max-lg:hidden">
            Podcastr
          </h1>
        </Link>

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            pathname === route || pathname.startsWith(`${route}/`)

          return (
            <Link
              key={label}
              href={route}
              className={cn(
                'flex items-center justify-center gap-3 py-4 max-lg:px-4 lg:justify-start',
                {
                  'border-r-4 border-orange-1 bg-nav-focus': isActive,
                },
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p>{label}</p>
            </Link>
          )
        })}
      </nav>

      <SignedOut>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button className="text-16 w-full bg-orange-1 font-extrabold" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex-center w-full pb-14 max-lg:px-4 lg:pr-8">
          <Button
            className="text-16 w-full bg-orange-1 font-extrabold"
            onClick={() => signOut(() => router.push('/'))}
          >
            Log Out
          </Button>
        </div>
      </SignedIn>
    </section>
  )
}
