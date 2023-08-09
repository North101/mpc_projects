import { useEffect, useState } from "react"
import { AppContainer } from "./AppContainer"
import ReactMarkdown from "react-markdown"


const useFetch = () => {
  const [data, setData] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch('/about.md');
      setData(await r.text());
    };

    fetchData();
  }, []);

  return data;
}


export const AboutPage = () => {
  const data = useFetch();
  return (
    <AppContainer>
      <div style={{ width: '80%', margin: 'auto' }}>
        <ReactMarkdown>{data ?? ''}</ReactMarkdown>
      </div>
    </AppContainer>
  )
}
