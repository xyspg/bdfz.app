import React from 'react'
import { DownVoteIcon, UpvoteIcon } from '@/components/Icon'
import Feedback from '@/components/Feedback'
import { clsx } from 'clsx'

interface FeedbackPanelProps {
  onFeedbackSubmit: (feedback: string) => void
  question: string
  answer: string | undefined
  feedback: string
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  question,
  answer,
  onFeedbackSubmit,
}) => {
  return (
    <>
      <div className="flex flex-row gap-2 justify-end">
        <div className="float-right py-1 flex flex-row gap-2 dark:text-neutral-200 text-neutral-700">
          <div
            className={clsx(
              'p-1.5 rounded-md',
              feedback !== ''
                ? `cursor-default`
                : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`,
              feedback === 'positive'
                ? `bg-neutral-200 dark:bg-neutral-700`
                : `bg-white dark:bg-neutral-800`
            )}
            onClick={() => {
              onFeedbackSubmit('positive')
            }}
          >
            <UpvoteIcon />
          </div>
          <div
            className={clsx(
              'p-1.5 rounded-md',
              feedback !== ''
                ? `cursor-default`
                : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`,
              feedback === 'negative'
                ? `bg-neutral-200 dark:bg-neutral-700`
                : `bg-white dark:bg-neutral-800`
            )}
            onClick={() => {
              onFeedbackSubmit('negative')
            }}
          >
            <DownVoteIcon />
          </div>
        </div>
        <Feedback question={question} answer={answer} />
      </div>
    </>
  )
}

export default FeedbackPanel
