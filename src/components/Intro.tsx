import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const homeIntro = (
  '<div class="intro w-100 m-auto"><p>&ldquo;It&rsquo;s just one little core set,&rdquo; you thought. &ldquo;Maybe I&rsquo;ll pick up an expansion or two; that will be plenty.&rdquo; But now, despite your efforts to the contrary, you own all the official content, and you&rsquo;e desperately need professionally printed copies of all the Arkham Horror community&rsquo;s homebrew content. You can no longer resist; it&rsquo;s time to accept your <strong>Inexorable Fate</strong>.</p></div>'
)

export const Intro = () => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
      {homeIntro}
    </ReactMarkdown>
  )
}
