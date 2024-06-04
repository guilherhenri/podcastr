import { Label } from '@radix-ui/react-label'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useAction, useMutation } from 'convex/react'
import { Loader } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { GenerateThumbnailProps } from '@/types'

import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'

export function GenerateThumbnail({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) {
  const { toast } = useToast()

  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const imageRef = useRef<HTMLInputElement>(null)

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl)
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)

  const handleImage = async (blob: Blob, filename: string) => {
    setIsImageLoading(true)
    setImage('')

    try {
      const file = new File([blob], filename, { type: 'image/png' })

      const uploaded = await startUpload([file])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storageId = (uploaded[0].response as any).storageId
      setImageStorageId(storageId)

      const imageUrl = await getImageUrl({ storageId })

      setImage(imageUrl ?? '')
      setIsImageLoading(false)
      toast({
        title: 'Thumbnail generated successfully',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error generating thumbnail',
        variant: 'destructive',
      })
    }
  }

  const generateImage = async () => {
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt })

      const blob = new Blob([response], { type: 'image/png' })

      handleImage(blob, `thumbnail-${uuid()}.png`)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error generating thumbnail',
        variant: 'destructive',
      })
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      const files = e.target.files

      if (!files) return

      const file = files[0]
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]))

      handleImage(blob, file.name)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error uploading image',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn('', {
            'bg-black-2': isAiThumbnail,
          })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn('', {
            'bg-black-2': !isAiThumbnail,
          })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload custom image
        </Button>
      </div>

      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>

          <div className="w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generateImage}
            >
              {isImageLoading ? (
                <>
                  Generating...
                  <Loader className="ml-2 animate-spin" size={20} />
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />

          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading...
              <Loader className="ml-2 animate-spin" size={20} />
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="flex-center w-full">
          <Image
            src={image}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  )
}
