'use client'

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '@/convex/_generated/api'

import { Carousel } from './Carousel'
import { Header } from './Header'

export function RightSidebar() {
  const { user } = useUser()

  const topPodcasters = useQuery(api.users.getTopUserByPodcastCount)

  return (
    <section className="right_sidebar">
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">
              {user?.firstName} ${user?.lastName}
            </h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>

      <section>
        <Header headerTitle="Fans Like You" />
        {topPodcasters && <Carousel fansLikeDetail={topPodcasters} />}
      </section>
    </section>
  )
}
