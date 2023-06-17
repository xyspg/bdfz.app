import React from 'react'
import { ButtonScrollToBottom } from "@/components/ui/button-scroll-to-bottom";
import { Button } from '@/components/ui/Button'
import {IconRefresh, IconStop} from "@/components/Icons";

export interface ChatPanelProps {
  isLoading: boolean
  stop: () => void
  reload: () => void
  messages: []
}

const ChatPanel: React.FC<ChatPanelProps> = ({isLoading, stop, reload, messages }) => {
  return <>
    <div className=" inset-x-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
              <Button
                  variant="outline"
                  onClick={() => stop()}
                  className="bg-background"
              >
                <IconStop className="mr-2" />
               暂停生成
              </Button>
          ) : (
              messages?.length > 1 && (
                  <Button
                      variant="outline"
                      onClick={() => reload()}
                      className="bg-background"
                  >
                    <IconRefresh className="mr-2" />
                    重新生成
                  </Button>
              )
          )}
        </div>
      </div>
    </div>
  </>
}

export default ChatPanel
