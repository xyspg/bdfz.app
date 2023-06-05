import { Fragment, useEffect, useRef, useState } from 'react'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useDebouncedCallback } from 'use-debounce'

import { AppScreen } from 'components/intro/AppScreen'
import { CircleBackground } from 'components/intro/CircleBackground'
import { Container } from 'components/intro/Container'
import { BackpackIcon, GraduationCapIcon, SchoolIcon } from 'lucide-react'

import rules from 'public/rules.png'
import ask_for_leave from 'public/ask_for_leave.png'
import course from 'public/course.png'

const MotionAppScreenHeader = motion(AppScreen.Header)
const MotionAppScreenBody = motion(AppScreen.Body)

const features = [
  {
    name: '校规校纪',
    description: '查询各类校规校纪，如培养目标、考勤制度、出入校门制度等。',
    icon: DeviceUserIcon,
    screen: InviteScreen,
  },
  {
    name: '学校事务',
    description: '查询学校各类事物，如 "如何申请荣誉文凭"，"如何请假"，"医务室在哪里" 等',
    icon: DeviceNotificationIcon,
    screen: StocksScreen,
  },
  {
    name: '课程相关',
    description: '提供本部及国际部课程查询，选课建议、课程 Prerequisite 等查询',
    icon: DeviceTouchIcon,
    screen: InvestScreen,
  },
]

function DeviceUserIcon(props) {
  return (
    <div className="text-white">
      <SchoolIcon />
    </div>
  )
}

function DeviceNotificationIcon(props) {
  return (
    <div className="text-white">
      <BackpackIcon />
    </div>
  )
}

function DeviceTouchIcon(props) {
  return (
    <div className="text-white">
      <GraduationCapIcon />
    </div>
  )
}

const headerAnimation = {
  initial: { opacity: 0, transition: { duration: 0.3 } },
  animate: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

const maxZIndex = 2147483647

const bodyVariantBackwards = {
  opacity: 0.4,
  scale: 0.8,
  zIndex: 0,
  filter: 'blur(4px)',
  transition: { duration: 0.4 },
}

const bodyVariantForwards = (custom) => ({
  y: '100%',
  zIndex: maxZIndex - custom.changeCount,
  transition: { duration: 0.4 },
})

const bodyAnimation = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: {
    initial: (custom) => (custom.isForwards ? bodyVariantForwards(custom) : bodyVariantBackwards),
    animate: (custom) => ({
      y: '0%',
      opacity: 1,
      scale: 1,
      zIndex: maxZIndex / 2 - custom.changeCount,
      filter: 'blur(0px)',
      transition: { duration: 0.4 },
    }),
    exit: (custom) => (custom.isForwards ? bodyVariantBackwards : bodyVariantForwards(custom)),
  },
}

function InviteScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <Image src={rules} alt="rules" priority="true" />
    </AppScreen>
  )
}

function StocksScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <Image src={ask_for_leave} alt="ask_for_leave" priority="true" />
    </AppScreen>
  )
}

function InvestScreen({ custom, animated = false }) {
  return (
    <AppScreen className="w-full">
      <Image src={course} alt="course" priority="true" />
    </AppScreen>
  )
}

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function FeaturesDesktop() {
  let [changeCount, setChangeCount] = useState(0)
  let [selectedIndex, setSelectedIndex] = useState(0)
  let prevIndex = usePrevious(selectedIndex)
  let isForwards = prevIndex === undefined ? true : selectedIndex > prevIndex

  let onChange = useDebouncedCallback(
    (selectedIndex) => {
      setSelectedIndex(selectedIndex)
      setChangeCount((changeCount) => changeCount + 1)
    },
    100,
    { leading: false }
  )

  return (
    <Tab.Group
      as="div"
      className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24"
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical
    >
      <Tab.List className="relative z-10 order-last col-span-6 space-y-6">
        {features.map((feature, featureIndex) => (
          <div
            key={feature.name}
            className="relative rounded-2xl transition-colors hover:bg-gray-800/30"
            onMouseEnter={() => onChange(featureIndex)}
          >
            {featureIndex === selectedIndex && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-gray-800"
                initial={{ borderRadius: 16 }}
              />
            )}
            <div className="relative z-10 p-8">
              <feature.icon className="h-8 w-8" />
              <h3 className="mt-6 text-lg font-semibold text-white">
                <Tab className="text-left [&:not(:focus-visible)]:focus:outline-none">
                  <span className="absolute inset-0 rounded-2xl" />
                  {feature.name}
                </Tab>
              </h3>
              <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </Tab.List>

      <div className="relative col-span-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <CircleBackground color="#7f1d1d" className="animate-spin-slower" />
        </div>
        <div className="z-10 relative mx-auto w-full max-w-[366px]">
          <Tab.Panels as={Fragment}>
            <div>
              {features.map((feature, featureIndex) =>
                selectedIndex === featureIndex ? (
                  <Tab.Panel
                    static
                    key={feature.name + changeCount}
                    className="col-start-1 row-start-1 flex focus:outline-offset-[32px] [&:not(:focus-visible)]:focus:outline-none"
                  >
                    <feature.screen animated custom={{ isForwards, changeCount }} />
                  </Tab.Panel>
                ) : null
              )}
            </div>
          </Tab.Panels>
        </div>
      </div>
    </Tab.Group>
  )
}

function FeaturesMobile() {
  let [activeIndex, setActiveIndex] = useState(0)
  let slideContainerRef = useRef()
  let slideRefs = useRef([])

  useEffect(() => {
    let observer = new window.IntersectionObserver(
      (entries) => {
        for (let entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(slideRefs.current.indexOf(entry.target))
            break
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      }
    )

    for (let slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide)
      }
    }

    return () => {
      observer.disconnect()
    }
  }, [slideContainerRef, slideRefs])

  return (
    <>
      <div
        ref={slideContainerRef}
        className="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, featureIndex) => (
          <div
            key={featureIndex}
            ref={(ref) => (slideRefs.current[featureIndex] = ref)}
            className="w-full flex-none snap-center px-4 sm:px-6"
          >
            <div className="relative transform overflow-hidden rounded-2xl bg-gray-800 px-5 py-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CircleBackground
                  color="#13B5C8"
                  className={featureIndex % 2 === 1 ? 'rotate-180' : undefined}
                />
              </div>
              <div className="relative mx-auto w-full max-w-[366px]">
                <feature.screen />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gray-800/95 p-6 backdrop-blur sm:p-10">
                <feature.icon className="h-8 w-8" />
                <h3 className="mt-6 text-sm font-semibold text-white sm:text-lg">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {features.map((_, featureIndex) => (
          <button
            type="button"
            key={featureIndex}
            className={clsx(
              'relative h-0.5 w-4 rounded-full',
              featureIndex === activeIndex ? 'bg-gray-300' : 'bg-gray-500'
            )}
            aria-label={`Go to slide ${featureIndex + 1}`}
            onClick={() => {
              slideRefs.current[featureIndex].scrollIntoView({
                block: 'nearest',
                inline: 'nearest',
              })
            }}
          >
            <span className="absolute -inset-x-1.5 -inset-y-3" />
          </button>
        ))}
      </div>
    </>
  )
}

export function PrimaryFeatures() {
  return (
    <section id="features" className="bg-gray-900 py-20 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
          <h2 className="text-3xl font-medium tracking-tight text-white">
            规章制度，校园信息，随时查询
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            我们通过 Embeddings
            技术，将学校文档和用户查询转化为数值向量，然后在向量空间中根据语义相似性进行快速准确的信息检索，即使查询和文档的表述不完全一致，也能有效找到相关信息，大大提升了查询的效率和灵活性。
          </p>
        </div>
      </Container>
      <div className="mt-16 md:hidden">
        <FeaturesMobile />
      </div>
      <Container className="hidden md:mt-20 md:block">
        <FeaturesDesktop />
      </Container>
    </section>
  )
}
