import Image from 'next/image'
import Link from 'next/link'

import { EmptyStateProps } from '@/types'

import { Button } from './ui/button'

export function EmptyState({
  title,
  search,
  buttonLink,
  buttonText,
}: EmptyStateProps) {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image
        src="/icons/emptyState.svg"
        width={250}
        height={250}
        alt="Empty state"
      />

      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white-1">
          {title}
        </h1>

        {search && (
          <p className="text-16 text-center font-medium text-white-2">
            Try adjusting you search to find what you are looking for
          </p>
        )}

        {buttonLink && (
          <Button className="bg-orange-1">
            <Link href={buttonLink} className="flex gap-1">
              <Image
                src="/icons/discover.svg"
                width={20}
                height={20}
                alt="discover"
              />
              <h1 className="text-16 font-extrabold text-white-1">
                {buttonText}
              </h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}
