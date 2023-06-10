import React from 'react'
import Layout from '@/components/Layout'
import { useState } from 'react'
import {
  Card,
  Grid,
  Metric,
  Tab,
  TabList,
  Text,
  Title,
  List,
  ListItem,
  DateRangePicker,
  DateRangePickerValue,
} from '@tremor/react'
import { useUser, useSession } from '@supabase/auth-helpers-react'
import useSWR from 'swr'
import axios from 'axios'
import { zhCN } from 'date-fns/locale'
import {sub} from 'date-fns'

const Admin = () => {
  const [selectedView, setSelectedView] = useState('1')
  const user = useUser()
  const session = useSession()
  const [dateRange, setDateRange] = useState<DateRangePickerValue>();
  const fetcher = (url: string) => {
    if (!session?.access_token) {
      throw new Error('Session is not initialized yet.')
    }

    return axios
      .get(url, { headers: { Authorization: 'Bearer ' + session.access_token } })
      .then((res) => res.data)
  }

  const { data, error, isLoading } = useSWR(
    session?.access_token ? '/api/admin?users' : null,
    fetcher
  )
  const totalUser = data?.users.length
  const {
    data: data2,
    error: error2,
    isLoading: isLoading2,
  } = useSWR(session?.access_token ? '/api/admin?tokens' : null, fetcher)
  interface Token {
    token_count: number
    gpt4_token_count: number
    user_email: string
  }
  const totalToken = data2?.tokens.reduce((a: number, b: Token) => a + b.token_count, 0)
  const totalCost = data2?.tokens
    .reduce(
      (a: number, b: Token) =>
        a +
        ((b.token_count - b.gpt4_token_count) / 1000) * 0.02 +
        (b.gpt4_token_count / 1000) * 0.231,
      0
    )
    .toFixed(2)
  const options = [
    { value: '1', text: '今天', startDate: new Date() },
    { value: '2', text: '昨天', startDate: sub(new Date(), { days: 1 }) },
    { value: '3', text: '最近7天', startDate: sub(new Date(), { days: 7 }) },
    { value: '4', text: '最近30天', startDate: sub(new Date(), { days: 30 }) },
    { value: '5', text: '最近90天', startDate: sub(new Date(), { days: 90 }) },
    { value: '6', text: '最近180天', startDate: sub(new Date(), { days: 180 }) },
  ]
  return (
    <Layout>
      <>
        <main className="p-6 sm:p-10">
          <Title>仪表盘</Title>
          <Text>管理员身份 {user?.email}</Text>

          <TabList
            defaultValue="1"
            onValueChange={(value) => setSelectedView(value)}
            className="mt-6"
          >
            <Tab value="1" text="数据总览" />
            <Tab value="2" text="详细数据" />
          </TabList>

          {selectedView === '1' ? (
            <>
              <Grid numColsLg={3} className="mt-6 gap-6">
                <Card>
                  <Title>总用户数</Title>
                  <Metric>{totalUser}</Metric>
                </Card>
                <Card>
                  <Title>总 Token 消耗</Title>
                  <Metric>{totalToken}</Metric>
                </Card>
                <Card>
                  <Title>总计费</Title>
                  <Metric>{totalCost} ¥</Metric>
                </Card>
              </Grid>

              <div className="mt-6">
                <Card>
                  <Title>Token 使用情况</Title>
                  <List>
                    {data2?.tokens.map((item: Token) => (
                      <>
                        <ListItem key={item.user_email}>
                          <span>{item.user_email}</span>
                          <span>{item.token_count} Tokens</span>
                        </ListItem>
                      </>
                    ))}
                  </List>
                </Card>
              </div>
            </>
          ) : (
            <Card className="mt-6">
              <DateRangePicker
                className="max-w-md "
                enableDropdown={true}
                locale={zhCN}
                placeholder={'选择日期'}
                dropdownPlaceholder={'选择时间段'}
                options={options}
              />
              <div className="h-96 flex justify-center items-center">
                <Text>Under Construction...</Text>
              </div>
            </Card>
          )}
        </main>
      </>
    </Layout>
  )
}

export default Admin
