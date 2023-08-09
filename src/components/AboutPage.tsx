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
      <div className="w-75 m-auto">
        <ReactMarkdown>{data ?? ''}</ReactMarkdown>
      </div>
    </AppContainer>
  )
}
