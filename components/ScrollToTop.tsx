import { motion, useAnimationControls, useScroll, Variants } from 'framer-motion'
import { useEffect } from 'react'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import * as React from 'react'

const isBrowser = () => typeof window !== 'undefined'

export function scrollToTop() {
  if (!isBrowser()) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const ScrollToTopContainerVariants: Variants = {
  hide: { opacity: 0, y: 100 },
  show: { opacity: 1, y: 0 },
}

export default function ScrollToTopButton() {
  const { scrollYProgress } = useScroll()
  const controls = useAnimationControls()

  useEffect(() => {
    return scrollYProgress.on('change', (latestValue) => {
      if (latestValue > 0.5) {
        controls.start('show')
      } else {
        controls.start('hide')
      }
    })
  })

  return (
    <motion.button
      className="fixed bottom-0 right-0 p-10"
      variants={ScrollToTopContainerVariants}
      initial="hide"
      animate={controls}
      onClick={scrollToTop}
    >
      <ArrowUpIcon />
    </motion.button>
  )
}
