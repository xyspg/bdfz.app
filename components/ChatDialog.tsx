'use client'

import * as React from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import style from '@/styles/markdown-styles.module.css'
import { SSE } from 'sse.js'
import { Frown, User } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import ScrollToTopButton, { scrollToTop } from '@/components/ScrollToTop'
import { TrashIcon } from '@radix-ui/react-icons'
import { v4 as uuidv4 } from 'uuid'
import { encode } from 'gpt-tokenizer'
import { useRouter } from 'next/router'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Components } from 'react-markdown';

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
  code({node, inline, className, children, ...props}) {
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
  }
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
  const [notificationShown, setNotificationShown] = React.useState(false)
  const [politicalSensitive, setPoliticalSensitive] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [showMore, setShowMore] = React.useState(false)
  const [lastRequestTime, setLastRequestTime] = React.useState(0)
  const [totalTokens, setTotalTokens] = React.useState<number | null>(0)
  const [chatHistory, setChatHistory] = React.useState(History)
  const [answerUpdated, setAnswerUpdated] = React.useState(false)
  const [hideInfo, setHideInfo] = React.useState(false)
  React.useEffect(()=>{
    if (Mode === 'Normal') {
      setHideInfo(true)
    }
  }, [Mode])


  const delay = 5000 // ms
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

  const showMoreList = [
    {
      category: '校规校纪',
      content: ['北大附中的培养目标是什么？', '处分的撤销程序是什么样的？'],
    },
    {
      category: '学校事务',
      content: [
        '如何申请荣誉文凭',
        '如何请假',
        '如何更换六选三选科',
        '医务室在哪里',
        '心理咨询预约的邮箱是什么',
        '如何申请创建社团',
        '如何申请社团经费',
        '老师记错考勤了怎么办？',
        '学考合格考缺考或不合格对个人是否有影响',
        '平板电脑如何申请领取',
      ],
    },
    {
      category: '本部课程',
      content: ['Track Team 是什么', '数学荣誉课程的内容是什么', 'BIY1101-N是什么课'],
    },
    {
      category: '国际部课程',
      content: [
        'What are CLA courses?',
        "I'm interested in neuroscience at Dalton.",
        "Could you introduce Dalton's economics courses?",
        "Please provide information on Dalton's Global Studies courses.",
        'Do I have to take IRP3 to graduate?',
        'What are the prerequisites for studying calculus?',
      ],
    },
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
        console.log(chatHistory)

        const {
          data: { session },
        } = await supabase.auth.getSession()
        let APIUrl;

        if (Mode === 'BDFZ') {
          APIUrl = '/api/vector-search-chat';
        } else if (Mode === 'Normal') {
          APIUrl = '/api/chat-completion';
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
    console.log(uuidv4())

    const mode = getMode()
    console.log(mode)

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
        question: pathname.includes('/c/')? History[History.length - 2].content : question,
        answer: pathname.includes('/c/')? History[History.length - 1].content : answer,
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

  type Message = {
    role: string
    content: string
  }
  React.useEffect(() => {
    console.log("Component mounted");

    return () => {
      console.log("Component unmounted");
    };
  }, []);


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

                          // @ts-ignore
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
                          ) : (
                              !hideInfo ? (<div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
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
                              </div>):(
                                  <div
                                      className=" rounded-sm flex items-center justify-center text-black h-9 w-9"
                                  >
                                    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg"
                                         strokeWidth="1.5" className="h-7 w-7" role="img">
                                      <path
                                          d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                          fill="currentColor"></path>
                                    </svg>
                                  </div>
                              )
                          )}
                        </span>
                                <div
                                    className={`mt-0.5 ${
                                        message.role === 'user' ? 'font-semibold' : 'font-normal'
                                    } text-slate-700 dark:text-slate-100 `}
                                ><ReactMarkdown
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
                    {!isGenerating && (
                        <div className=''>
                          <div className="float-right py-1 flex flex-row gap-2 dark:text-neutral-200 text-neutral-700">
                            <div
                                className={`p-1.5 rounded-md ${
                                    feedback !== ''
                                        ? `cursor-default`
                                        : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`
                                } ${
                                    feedback === 'positive'
                                        ? `bg-neutral-200 dark:bg-neutral-700`
                                        : `bg-white dark:bg-neutral-800`
                                }`}
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
                                    feedback !== ''
                                        ? `cursor-default`
                                        : `cursor-pointer dark:hover:bg-neutral-700 hover:bg-neutral-200`
                                } ${
                                    feedback === 'negative'
                                        ? `bg-neutral-200 dark:bg-neutral-700`
                                        : `bg-white dark:bg-neutral-800`
                                }`}
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
                        </div>
                    )}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-4 dark:text-white max-w-3xl p-4 rounded-xl bg-neutral-100 dark:bg-neutral-700"
                        >
                          {!hideInfo ? (<div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
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
                          </div>):(
                              <div
                                  className=" rounded-sm flex items-center justify-center text-black h-9 w-9"
                              >
                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg"
                                     strokeWidth="1.5" className="h-7 w-7" role="img">
                                  <path
                                      d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                      fill="currentColor"></path>
                                </svg>
                              </div>
                          )}
                          <div className="ml-1 bg-neutral-500 h-[17px] w-[11px] animate-pulse animate-bounce" />
                        </motion.div>
                    )}

                    {answer && !hasError && isGenerating ? (
                        <>
                          <div className="flex gap-4 my-1 dark:text-white max-w-[85vw] p-4 bg-neutral-100 dark:bg-neutral-700 rounded-xl items-center">
                            {!hideInfo ? (<div className="w-7 min-w-[28px] ml-0.5 h-7 bg-gradient-to-r from-red-900 to-red-800 ring-red-600 ring-1 rounded-md border border-brand-400 flex items-center justify-center shadow-sm ">
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
                            </div>):(
                                <div
                                    className=" rounded-sm flex items-center justify-center text-black h-9 w-9"
                                >
                                  <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg"
                                       strokeWidth="1.5" className="h-7 w-7" role="img">
                                    <path
                                        d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                        fill="currentColor"></path>
                                  </svg>
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
                    onClick={isGenerating ? stopGenerating : handleSubmit}
                    data-umami-event={isGenerating ? 'Click stop' : 'Click ask'}
                    className="md:w-20 w-3/4 bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
                >
                  {isGenerating ? 'Stop' : 'Ask'}
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
            {!hideInfo && (
                <>
                  <div className="rounded-md border px-1.5 py-3 md:px-3 md:py-3 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between items-center bg-scale-400 border-scale-500 dark:bg-scale-100 dark:border-scale-300 mb-3 w-full gap-2">
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
                          className="text-scale-900"
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
                              &nbsp;等文件为准
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-col md:flex-row flex-grow space-y-2 md:space-y-0 gap-2 dark:text-gray-100 items-stretch md:items-start">
                    <div className="pt-1.5 mx-auto md:w-20">Or try:</div>
                    <div className="flex flex-col gap-4">
                      <div className="mt-1 flex gap-3 md:gap-x-2.5 md:gap-y-1 flex-col md:flex-row w-full md:w-auto md:flex-wrap">
                        {sampleQuestion.map((q) => (
                            <button
                                key={q}
                                type="button"
                                data-umami-event={'ask: ' + q}
                                className="px-1.5 py-3 md:py-0.5 md:px-1.5 md:w-fit h-full
                    md:h-auto cursor-pointer
                  bg-slate-50 dark:bg-neutral-700 text-sm md:text-xs
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded-md border border-slate-200 dark:border-neutral-600
                  transition-colors"
                                onClick={(_) => {
                                  setSearch(q)
                                  handleConfirm(q)
                                  scrollToTop()
                                }}
                            >
                              {q}
                            </button>
                        ))}
                      </div>
                      <div
                          className="md:w-fit h-full
                  md:h-auto cursor-pointer
                  flex justify-center
                  bg-white dark:bg-neutral-800
                  dark:text-white text-[15px]
                  rounded-md underline-offset-4 underline
                  transition-colors"
                          onClick={() => {
                            setShowMore(!showMore)
                          }}
                      >
                        {showMore ? '收起列表' : '查看更多...'}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {showMore ? (
                        <>
                          <hr />
                          <motion.div
                              initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                          >
                            <div className=" flex flex-col justify-start gap-4">
                              {showMoreList.map((category) => (
                                  <>
                                    <div
                                        key={category.category}
                                        className="flex flex-col  md:flex-row items-center gap-4 md:gap-12"
                                    >
                                      <h1 className="text-xl font-bold dark:text-white md:w-1/4">
                                        {category.category}
                                      </h1>
                                      <div className="flex flex-wrap gap-4 md:w-3/4 justify-start">
                                        {category.content.map((content) => (
                                            <>
                                              <div
                                                  key={content}
                                                  className="
                          text-sm text-neutral-700 dark:text-neutral-200
                          px-2.5 py-1.5 md:px-3 md:py-1.5
                          border-2 border-neutral-200 dark:border-neutral-600
                          rounded-lg cursor-pointer
                          bg-slate-50 hover:bg-slate-100
                          dark:bg-neutral-700  dark:hover:bg-gray-600
                          "
                                                  data-umami-event={'ask: ' + content}
                                                  onClick={() => {
                                                    scrollToTop()
                                                    handleConfirm(content)
                                                  }}
                                              >
                                                {content}
                                              </div>
                                            </>
                                        ))}
                                      </div>
                                    </div>
                                    <hr />
                                  </>
                              ))}
                            </div>
                          </motion.div>
                        </>
                    ) : null}
                  </AnimatePresence>
                </>
            )}

          </div>
        </div>
        <ScrollToTopButton />
      </>
  )
}
