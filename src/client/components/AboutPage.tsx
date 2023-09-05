import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { AppContainer } from './AppContainer'


const useFetch = () => {
  const [data, setData] = useState<string | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch('/about.md')
      setData(await r.text())
    }

    fetchData()
  }, [])

  return data
}


export const AboutPage = () => {
  const data = useFetch()
  return (
    <AppContainer>
      <div className='w-75 m-auto'>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {data ?? ''}
        </ReactMarkdown>
      </div>
    </AppContainer>
  )
}
