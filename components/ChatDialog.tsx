'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import style from '@/styles/markdown-styles.module.css'
import { SSE } from 'sse.js'
import { Frown, User } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import ScrollToTopButton from '@/components/ScrollToTop'
import { TrashIcon } from '@radix-ui/react-icons'
import { v4 as uuidv4 } from 'uuid'
import { encode } from 'gpt-tokenizer'
import { useRouter } from 'next/router'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import ChatPanel from '@/components/ChatPanel'
import FeedbackPanel from '@/components/chat/FeedbackPanel'
import SampleQuestion from '@/components/chat/SampleQuestion'
import { AIIcon, OpenAIIcon } from '@/components/Icon'

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

interface ChatHistoryProps {
  History: any
  Mode: any
}

interface ChatMessage {
  role: string
  content: string
}

// Code block syntax highlighting
const renderers: Partial<Components> = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      //@ts-ignore
      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

export const ChatDialog: React.FC<ChatHistoryProps> = ({ History, Mode }) => {
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
  const [politicalSensitive, setPoliticalSensitive] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [lastRequestTime, setLastRequestTime] = React.useState(0)
  const [chatHistory, setChatHistory] = React.useState(History)
  const [answerUpdated, setAnswerUpdated] = React.useState(false)
  const [hideInfo, setHideInfo] = React.useState(false)
  React.useEffect(() => {
    if (Mode === 'Normal') {
      setHideInfo(true)
    }
  }, [Mode])

  const delay = 2000 // ms
  const supabase = useSupabaseClient()

  const user = useUser()
  const userId = user?.id
  const router = useRouter()
  const pathname = router.asPath

  const chatIdShouldBe = pathname.includes('/c/') ? pathname.slice(3) : uuidv4()
  const [chatId, setChatId] = React.useState(chatIdShouldBe)

  const sampleQuestion = [
    '我在升旗仪式迟到了16分钟会发生什么?',
    '列出预科部的日程',
    '我如何申请荣誉文凭?',
    '我在 Dalton 应该上 Statistics 还是 Calculus',
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
    if (question.includes('道尔顿') || question.includes('国际部')) {
      toast(
        '🤔️ When asking questions specific to Dalton, using English will yield better results.',
        {
          position: 'top-right',
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      )
    }
  }, [question])

  React.useEffect(() => {
    if (answer) {
      setChatHistory((prevChatHistory: ChatMessage[]) => [
        ...prevChatHistory,
        { role: 'assistant', content: answer },
      ])
      setAnswerUpdated(true)
      console.log('Chat History: ', chatHistory)
    }
  }, [isGenerating])

  React.useEffect(() => {
    if (answerUpdated) {
      sendStatistics()
      setAnswerUpdated(false)
    }
  }, [answerUpdated])

  const handleConfirm = React.useCallback(
    async (query: string) => {
      const currentTime = new Date().getTime()
      const delayInSec = (delay - (currentTime - lastRequestTime)) / 1000
      if (currentTime - lastRequestTime < delay) {
        // If the time since the last request is less than the delay, prevent request and show error
        toast.error(`请求过于频繁，请${delayInSec}秒后再试`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
        return
      } else {
        setLastRequestTime(currentTime) // Update lastRequestTime
      }
      /*
                    Append the user input to the chat history
                     */
      const userInput = query
      setChatHistory((prevChatHistory: ChatMessage[]) => [
        ...prevChatHistory,
        { role: 'user', content: query },
      ])

      if (isGenerating) stopGenerating()
      setAnswer(undefined)
      setQuestion(query)
      setSearch('')
      dispatchPromptData({ index: promptIndex, answer: undefined, query })
      setHasError(false)
      setIsLoading(true)
      setIsGenerating(true)
      setFeedback('')
      setHasFlaggedContent(false)
      setPoliticalSensitive(false)
      setErrorMessage('')

      const {
        data: { session },
      } = await supabase.auth.getSession()
      let APIUrl

      if (Mode === 'BDFZ') {
        APIUrl = '/api/vector-search-chat'
      } else if (Mode === 'Normal') {
        APIUrl = '/api/chat-completion'
      } else {
        APIUrl = '/api/vector-search-chat'
      }
      const eventSource = new SSE(APIUrl, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ query, messages: chatHistory }),
      })

      function handleError<T>(err: T) {
        setIsGenerating(false)
        setIsLoading(false)
        const errorData = JSON.parse((err as any).data)
        const errorMessage = errorData.error
        console.error(errorMessage)
        // if the error is flagged content, we show `6` as the answer
        if (errorMessage === 'Flagged content') {
          setHasFlaggedContent(true)
          setIsGenerating(false)
          setAnswer('6')
        } else if (errorMessage === 'Flagged content politics') {
          setHasError(true)
          setHasFlaggedContent(true)
          setPoliticalSensitive(true)
        } else {
          // handle regular error, show `server busy`
          setHasError(true)
          setErrorMessage(errorMessage)
          // if the error is political sensitive content, we show `server busy`
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
    [promptIndex, promptData, lastRequestTime, chatHistory]
  )

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleConfirm(search)
  }

  const getMode = () => {
    if (Mode === 'BDFZ') return 'bdfz'
    if (Mode === 'Normal') return 'gpt-4'
    return 'bdfz'
  }

  const sendStatistics = async () => {
    if (sampleQuestion.includes(question)) return

    const fpPromise = FingerprintJS.load()
    const fp = await fpPromise
    const result = await fp.get()

    const deviceInfo = {
      platform: result.components.platform.value,
      osCpu: result.components.osCpu.value,
      browserVendor: result.components.vendor.value,
      screenResolution: result.components.screenResolution.value,
    }

    const timestamp = new Date().toISOString() // Current timestamp in ISO format
    const chat_history = chatHistory

    const mode = getMode()

    // Count total number of words in the chat history
    const total_word_count =
      chat_history.reduce(
        (total: number, message: { content: string }) => total + encode(message.content).length,
        0
      ) + encode(question).length

    await fetch('/api/chat-statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        chat_history,
        total_word_count,
        timestamp,
        deviceInfo,
        hasFlaggedContent,
        mode,
      }),
    })
  }

  const sendFeedback = async (f: string) => {
    // If feedback is empty, do not send
    if (feedback !== '') return
    setFeedback(f)
    const fpPromise = FingerprintJS.load()
    const fp = await fpPromise
    const result = await fp.get()

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
        question: pathname.includes('/c/') ? History[History.length - 2].content : question,
        answer: pathname.includes('/c/') ? History[History.length - 1].content : answer,
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
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 && !isGenerating) {
      e.preventDefault()
      handleConfirm(search)
    }
  }

  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  type ChatHistory = ChatMessage[]

  const regenerate = () => {
    const currentTime = new Date().getTime()
    if (currentTime - lastRequestTime < delay) {
      return
    }
    let lastMessage = null
    let lastUserMessageIndex = -1
    /*

    Consider two cases: Whether the chat was cancelled before a response is returned
    if no response is present, the last item in the chat history object is the user's input
    if a response is present, the second last item in the chat history object is the response from api

     */

    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].role === 'user') {
        lastMessage = chatHistory[i]
        lastUserMessageIndex = i
        break
      }
    }

    if (lastUserMessageIndex >= 0) {
      if (lastUserMessageIndex !== chatHistory.length - 1) {
        // Response present, delete both the user message and the response
        setChatHistory(
          chatHistory
            .slice(0, lastUserMessageIndex)
            .concat(chatHistory.slice(lastUserMessageIndex + 2))
        )
      } else if (lastUserMessageIndex === chatHistory.length - 1) {
        // No response present, delete only the user message
        setChatHistory(chatHistory.slice(0, lastUserMessageIndex))
      }
      handleConfirm(lastMessage.content)
    }
  }

  type Message = {
    role: string
    content: string
  }

  return (
    <>
      <div>
        <div className="grid gap-5 text-slate-700 w-screen max-w-3xl px-6 pb-4  ">
          <ToastContainer />
          {chatHistory.length > 1 && (
            <>
              <div className="flex flex-col my-1 dark:text-white max-w-[85vw]">
                {chatHistory
                  .slice(1, chatHistory.length) // Remove the first item
                  .map((message: Message, index: number) => {
                    // Check if it's the last item and role is assistant
                    return (
                      <div
                        key={index}
                        className={`flex gap-x-4 p-4 rounded-xl items-start ${
                          message.role === 'assistant' && 'bg-neutral-100 dark:bg-neutral-700'
                        }`}
                      >
                        <span>
                          {message.role === 'user' ? (
                            <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center ">
                              <User width={18} />
                            </span>
                          ) : !hideInfo ? (
                            <div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
                              <AIIcon />
                            </div>
                          ) : (
                            <div className=" rounded-sm flex items-center justify-center text-black h-9 w-9">
                              <OpenAIIcon />
                            </div>
                          )}
                        </span>
                        <div
                          className={`mt-0.5 ${
                            message.role === 'user' ? 'font-semibold' : 'font-normal'
                          } text-slate-700 dark:text-slate-100 `}
                        >
                          <ReactMarkdown
                            linkTarget="_blank"
                            className={style.reactMarkDown}
                            remarkPlugins={[remarkGfm]}
                            components={renderers as Components}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )
                  })}
                {!isGenerating && !hasError && (
                  <FeedbackPanel
                    onFeedbackSubmit={sendFeedback}
                    question={question}
                    answer={answer}
                    feedback={feedback}
                  />
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4 dark:text-white max-w-3xl p-4 rounded-xl bg-neutral-100 dark:bg-neutral-700"
                  >
                    {!hideInfo ? (
                      <div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
                        <AIIcon />
                      </div>
                    ) : (
                      <div className=" rounded-sm flex items-center justify-center text-black h-9 w-9">
                        <OpenAIIcon />
                      </div>
                    )}
                    <div className="ml-1 bg-neutral-500 h-[17px] w-[11px] animate-pulse animate-bounce" />
                  </motion.div>
                )}

                {answer && !hasError && isGenerating ? (
                  <>
                    <div className="flex gap-4 my-1 dark:text-white max-w-[85vw] p-4 bg-neutral-100 dark:bg-neutral-700 rounded-xl items-center">
                      {!hideInfo ? (
                        <div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
                          <AIIcon />
                        </div>
                      ) : (
                        <div className=" rounded-sm flex items-center justify-center text-black h-9 w-9">
                          <OpenAIIcon />
                        </div>
                      )}
                      <div className="w-full overflow-x-auto">
                        <ReactMarkdown
                          linkTarget="_blank"
                          className={style.reactMarkDown}
                          remarkPlugins={[remarkGfm]}
                          components={renderers as Components}
                        >
                          {answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}

          {hasError && (
            <div className="flex items-center gap-4 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-xl">
              <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                <Frown width={18} />
              </span>
              <span className="text-slate-700 dark:text-slate-100">
                {errorMessage ? errorMessage : '服务器繁忙，请稍后再试'}
              </span>
            </div>
          )}
          {chatHistory.length > 1 && (
            <ChatPanel
              isLoading={isGenerating}
              stop={stopGenerating}
              reload={regenerate}
              messages={chatHistory}
            />
          )}

          <div className="relative flex flex-col md:flex-row gap-4">
            <Input
              ref={inputRef}
              placeholder="输入问题..."
              name="search"
              value={search}
              maxLength={4000}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="col-span-3"
              autoFocus={true}
            />
            <div className="flex flex-row gap-2">
              <Button
                onClick={isGenerating ? () => {} : handleSubmit}
                disabled={isGenerating}
                data-umami-event={isGenerating ? 'Click stop (deprecated)' : 'Click ask'}
                className="md:w-20 w-3/4 bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
              >
                Ask
              </Button>
              <Button
                variant="outline"
                className="md:w-12 w-1/4 shadow-md hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                onClick={() => {
                  stopGenerating()
                  setChatHistory(History)
                  setAnswer(undefined)
                  setSearch('')
                  setHasError(false)
                  setFeedback('')
                  setHasFlaggedContent(false)
                  setPoliticalSensitive(false)
                  setErrorMessage('')
                  setChatId(uuidv4())
                }}
                disabled={pathname.startsWith('/c/')}
              >
                <span className="text-xl">
                  <TrashIcon />
                </span>
              </Button>
            </div>
          </div>
          {!hideInfo && <SampleQuestion onQuery={handleConfirm} />}
        </div>
      </div>
      <ScrollToTopButton />
    </>
  )
}
