import React from 'react'
import { MicroscopeIcon } from '@/components/Icon'
import { scrollToTop } from '@/components/ScrollToTop'
import { AnimatePresence, motion } from 'framer-motion'

interface SampleQuestionProps {
  onQuery: (query: string) => void
}

const SampleQuestion: React.FC<SampleQuestionProps> = ({ onQuery }) => {
  const [showMore, setShowMore] = React.useState(false)

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
  return (
    <>
      <div className="rounded-md border px-1.5 py-3 md:px-3 md:py-3 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 justify-between items-center bg-scale-400 border-scale-500 dark:bg-scale-100 dark:border-scale-300 mb-3 w-full gap-2">
        <div className="text-scale-1200 dark:text-neutral-200 flex flex-row items-start gap-2 justify-center">
          <MicroscopeIcon />
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
                  onQuery(q)
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
                                onQuery(content)
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
  )
}

export default SampleQuestion
