import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import * as Checkbox from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'

interface FeedbackProps {
  question: string
  answer: string | undefined
}

const FeedbackDialog: React.FC<FeedbackProps> = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false)
  const [feedBackBody, setFeedBackBody] = React.useState('')
  const [isChecked1, setIsChecked1] = React.useState(false)
  const [isChecked2, setIsChecked2] = React.useState(false)
  const [isChecked3, setIsChecked3] = React.useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const timestamp = new Date().toISOString()
    const res = await fetch('/api/feedback-text', {
      body: JSON.stringify({
        question,
        answer,
        feedBackBody,
        isChecked1,
        isChecked2,
        isChecked3,
        timestamp,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="text-mauve11 text-sm shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] py-2 leading-none ">
          提供反馈
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />

        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <form>
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
              提供额外反馈
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
              您认为这个回答有什么问题？
            </Dialog.Description>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <textarea
                className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[100px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px] "
                value={feedBackBody}
                onChange={(e) => setFeedBackBody(e.target.value)}
              />
            </fieldset>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Checkbox.Root
                  className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
                  id="c1"
                  checked={isChecked1}
                  onCheckedChange={() => {
                    setIsChecked1(!isChecked1)
                  }}
                >
                  <Checkbox.Indicator className="text-violet11">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="pl-[15px] text-[15px] leading-none text-mauve11" htmlFor="c1">
                  这个回答有害 / 不安全
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox.Root
                  className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
                  id="c2"
                  checked={isChecked2}
                  onCheckedChange={() => {
                    setIsChecked2(!isChecked2)
                  }}
                >
                  <Checkbox.Indicator className="text-violet11">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="pl-[15px] text-[15px] leading-none text-mauve11" htmlFor="c2">
                  这个回答不实
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox.Root
                  className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px_black]"
                  id="c3"
                  checked={isChecked3}
                  onCheckedChange={() => {
                    setIsChecked3(!isChecked3)
                  }}
                >
                  <Checkbox.Indicator className="text-violet11">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="pl-[15px] text-[15px] leading-none text-mauve11" htmlFor="c3">
                  这个回答对我没有帮助
                </label>
              </div>
            </div>
            <div className="mt-[25px] flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    handleSubmit(e).then(() => setOpen(false))
                  }}
                  className="bg-red4 text-red11 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                >
                  提交
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Close asChild>
              <button
                type="submit"
                onClick={(e) => {
                  handleSubmit(e).then(() => setOpen(false))
                }}
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>{' '}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default FeedbackDialog
