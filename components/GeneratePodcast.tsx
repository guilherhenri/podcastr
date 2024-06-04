import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useAction, useMutation } from 'convex/react'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { api } from '@/convex/_generated/api'
import { GeneratePodcastProps } from '@/types'

import { Button } from './ui/button'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useToast } from './ui/use-toast'

const useGeneratePodcast = ({
  setAudio,
  voiceType,
  voicePrompt,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const { toast } = useToast()

  const [isGenerating, setIsGenerating] = useState(false)

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getPodcastAudio = useAction(api.openai.generateAudioAction)
  const getAudioUrl = useMutation(api.podcasts.getUrl)

  const generatePodcast = async () => {
    setIsGenerating(true)
    setAudio('')

    if (!voicePrompt || !voiceType) {
      toast({
        title: 'Please provide a voiceType and prompt to generate a podcast',
      })

      return setIsGenerating(false)
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      })

      const blob = new Blob([response], { type: 'audio/mpeg' })
      const filename = `podcast-${uuid()}.mp3`
      const file = new File([blob], filename, { type: 'audio/mpeg' })

      const uploaded = await startUpload([file])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storageId = (uploaded[0].response as any).storageId
      setAudioStorageId(storageId)

      const audioUrl = await getAudioUrl({ storageId })
      setAudio(audioUrl ?? '')

      setIsGenerating(false)
      toast({
        title: 'Podcast generated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error creating podcast',
        variant: 'destructive',
      })
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    generatePodcast,
  }
}

export function GeneratePodcast(props: GeneratePodcastProps) {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props)

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI Prompt to generate Podcast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>

      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="submit"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
          disabled={!props.voiceType}
        >
          {isGenerating ? (
            <>
              Generating...
              <Loader className="ml-2 animate-spin" size={20} />
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>

      {props.audio && (
        <audio
          controls
          src={props.audio}
          className="mt-5"
          autoPlay
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  )
}
