'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import style from '@/styles/markdown-styles.module.css'
import { SSE } from 'sse.js'
import { Frown, User } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const fpPromise = FingerprintJS.load()
;(async () => {
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  const result = await fp.get()
  console.log(result.visitorId)
})()

function promptDataReducer(
  state: any[],
  action: {
    index?: number
    answer?: string | undefined
    status?: string
    query?: string | undefined
    type?: 'remove-last-item' | string
  }
) {
  // set a standard state to use later
  let current = [...state]

  if (action.type) {
    switch (action.type) {
      case 'remove-last-item':
        current.pop()
        return [...current]
      default:
        break
    }
  }

  // check that an index is present
  if (action.index === undefined) return [...state]

  if (!current[action.index]) {
    current[action.index] = { query: '', answer: '', status: '' }
  }

  current[action.index].answer = action.answer

  if (action.query) {
    current[action.index].query = action.query
  }
  if (action.status) {
    current[action.index].status = action.status
  }

  return [...current]
}

export function SearchDialog() {
  const [search, setSearch] = React.useState<string>('')
  const [question, setQuestion] = React.useState<string>('')
  const [answer, setAnswer] = React.useState<string | undefined>('')
  const eventSourceRef = React.useRef<SSE>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [hasFlaggedContent, setHasFlaggedContent] = React.useState(false)
  const [promptIndex, setPromptIndex] = React.useState(0)
  const [promptData, dispatchPromptData] = React.useReducer(promptDataReducer, [])
  const [feedback, setFeedback] = React.useState('')

  const sampleQuestion = [
    '我在升旗仪式迟到了16分钟会发生什么?',
    '列出预科部的日程',
    '我如何申请荣誉文凭?',
    '我在国际部选课只选一年的CLA可以毕业吗?',
    '我在新民书活吃一次零食会扣多少学时？',
  ]

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('esc')
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  React.useEffect(() => {
    if (!isGenerating && answer) {
      sendStatistics()
    }
  }, [answer, isGenerating])

  const handleConfirm = React.useCallback(
    async (query: string) => {
      setAnswer(undefined)
      setQuestion(query)
      setSearch('')
      dispatchPromptData({ index: promptIndex, answer: undefined, query })
      setHasError(false)
      setIsLoading(true)
      setIsGenerating(true)
      setFeedback('')

      const eventSource = new SSE(`api/vector-search`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ query }),
      })

      function handleError<T>(err: T) {
        setIsGenerating(false)
        setIsLoading(false)
        const errorData = JSON.parse((err as any).data)
        const errorMessage = errorData.error
        console.error(errorMessage)
        if (errorMessage === 'Flagged content') {
          setHasFlaggedContent(true)
          setIsGenerating(false)
          setAnswer('6')
        } else {
          setHasError(true)
        }
      }

      eventSource.addEventListener('error', handleError)
      eventSource.addEventListener('message', (e: any) => {
        try {
          setIsLoading(false)
          if (e.data === '[DONE]') {
            setPromptIndex((x) => {
              return x + 1
            })
            setIsGenerating(false)
            return
          }

          // 应该在代码顶部放置断言，以确保 `e.data` 符合 `string` 类型
          // 另外，请注意，使用类型断言会带来运行时错误的风险，因此对于不确定类型的值，请确保进行有效的类型验证
          const completionResponse = JSON.parse(e.data)
          const text = completionResponse.choices[0].delta?.content || ''

          setAnswer((answer) => {
            const currentAnswer = answer ?? ''

            dispatchPromptData({
              index: promptIndex,
              answer: currentAnswer + text,
            })

            return (answer ?? '') + text
          })
        } catch (err) {
          handleError(err)
        }
      })

      eventSource.stream()

      eventSourceRef.current = eventSource

      setIsLoading(true)
    },
    [promptIndex, promptData]
  )

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    handleConfirm(search)
  }

  const sendStatistics = async () => {
    if (sampleQuestion.includes(question)) return

    const fp = await fpPromise
    const result = await fp.get()
    const visitorId = result.visitorId

    const deviceInfo = {
      platform: result.components.platform.value,
      osCpu: result.components.osCpu.value,
      browserVendor: result.components.vendor.value,
      screenResolution: result.components.screenResolution.value,
    }

    const timestamp = new Date().toISOString() // Current timestamp in ISO format

    await fetch('/api/statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        question,
        answer,
        timestamp,
        deviceInfo,
        hasFlaggedContent,
      }),
    })
  }

  const sendFeedback = async (f: string) => {
    if(feedback !== '') return;
    setFeedback(f)
    const fp = await fpPromise
    const result = await fp.get()
    const visitorId = result.visitorId

    const deviceInfo = {
      platform: result.components.platform.value,
      osCpu: result.components.osCpu.value,
      browserVendor: result.components.vendor.value,
      screenResolution: result.components.screenResolution.value,
    }

    const timestamp = new Date().toISOString()

    await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        visitorId,
        question,
        answer,
        f,
        timestamp,
        deviceInfo,
      }),
    })
  }

  const stopGenerating = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleConfirm(search)
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div>
        <div className="grid gap-4 text-slate-700 w-screen px-6 pb-4 max-w-3xl">
          {question && (
            <div className="flex gap-4">
              <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                <User width={18} />
              </span>
              <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{question}</p>
            </div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 dark:text-white max-w-3xl"
            >
              <div className="w-7 ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  ></path>
                </svg>
              </div>
              <div className="ml-1 bg-neutral-500 h-[17px] w-[11px] animate-pulse animate-bounce" />
            </motion.div>
          )}

          {hasError && (
            <div className="flex items-center gap-4">
              <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                <Frown width={18} />
              </span>
              <span className="text-slate-700 dark:text-slate-100">服务器繁忙，请稍后再试</span>
            </div>
          )}

          {answer && !hasError ? (
            <>
              <div className="flex justify-start gap-4 dark:text-white max-w-3xl ml-0.5 my-1">
                <div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    ></path>
                  </svg>
                </div>
                <ReactMarkdown
                  linkTarget="_blank"
                  className={style.reactMarkDown}
                  remarkPlugins={[remarkGfm]}
                >
                  {answer}
                </ReactMarkdown>
              </div>
              <div>
                {/*  Feedback Button*/}
                {!isGenerating && (
                  <>
                    <div
                      className="float-right flex flex-row gap-2 dark:text-neutral-200 text-neutral-700
              "
                    >
                      <div
                        className={`p-1.5 rounded-md ${
                          feedback !== '' ? `cursor-default` : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`
                        } ${feedback === 'positive' ? `bg-neutral-200 dark:bg-neutral-700`:`bg-white dark:bg-neutral-800`}`}
                        onClick={() => {
                          sendFeedback('positive')
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                      </div>
                      <div
                        className={`p-1.5 rounded-md ${
                          feedback !== '' ? `cursor-default` : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`
                        } ${feedback === 'negative' ? `bg-neutral-200 dark:bg-neutral-700`:`bg-white dark:bg-neutral-800`}`}
                        onClick={() => {
                          sendFeedback('negative')
                        }}
                      >
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          height="1em"
                          width="1em"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </>
          ) : null}

          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="输入问题..."
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
              autoFocus={true}
            />
          </div>
          <div className="text-xs text-gray-500 flex flex-col md:flex-row flex-grow space-y-2 md:space-y-0 gap-2 dark:text-gray-100 items-center">
            <div className="w-14">Or try:</div>
            <div className="mt-1 flex gap-3 md:gap-x-2.5 md:gap-y-1 flex-col md:flex-row w-full md:w-auto md:flex-wrap">
              {sampleQuestion.map((q) => (
                <button
                  key={q}
                  type="button"
                  data-umami-event={'ask: ' + q}
                  className="px-1.5 py-3 md:py-0.5 md:px-1.5 md:w-fit h-full
                    md:h-auto
                  bg-slate-50 dark:bg-neutral-700 text-sm md:text-xs
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded-md border border-slate-200 dark:border-neutral-600
                  transition-colors"
                  onClick={(_) => setSearch(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md border px-1.5 py-3 md:p-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between items-center bg-scale-400 border-scale-500 dark:bg-scale-100 dark:border-scale-300 mb-3 w-full gap-2">
            <div className="text-scale-1200 dark:text-neutral-200 flex flex-row items-start gap-2 justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text -scale-900"
              >
                <path d="M6 18h8"></path>
                <path d="M3 22h18"></path>
                <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                <path d="M9 14h2"></path>
                <path d="M8 6h4"></path>
                <path d="M13 10V6.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2.5a.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V10c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2Z"></path>
              </svg>
              <div className="flex flex-1 items-center justify-between">
                <div className="text-left">
                  <h3 className="text-scale-1200 dark:text-neutral-200 block text-[13px] md:text-sm font-medium mb-1">
                    BDFZ AI 处于 Beta 版本，可能会产生错误答案
                  </h3>
                  <div className="text-xs text-scale-900 dark:text-neutral-300 inline-flex flex-row leading-5">
                    <p>
                      回答由 AI 检索学校官方文件后生成，请以 <br className="md:hidden" />
                      <a
                        href="https://pkuschool.yuque.com/infodesk/sbook?#%20%E3%80%8A%E5%8C%97%E5%A4%A7%E9%99%84%E4%B8%AD%E5%AD%A6%E7%94%9F%E6%89%8B%E5%86%8C%E3%80%8B"
                        target="_blank"
                        className="text-neutral-500 underline dark:text-neutral-200 underline-offset-2 hover:opacity-70"
                        rel="noopener noreferer"
                      >
                        北大附中学生手册
                      </a>
                      &nbsp;为准
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              //@ts-ignore
              onClick={isGenerating ? stopGenerating : handleSubmit}
              data-umami-event={isGenerating ? 'Click stop' : 'Click ask'}
              className="md:w-20 w-full bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
            >
              {isGenerating ? 'Stop' : 'Ask'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
