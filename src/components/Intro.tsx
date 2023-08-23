import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const oldHomeIntro = (
  '<div class="intro w-100 m-auto"><p>&ldquo;It&rsquo;s just one little core set,&rdquo; you thought. &ldquo;Maybe I&rsquo;ll pick up an expansion or two; that will be plenty.&rdquo; But now, despite your efforts to the contrary, you own all the official content, and you&rsquo;e desperately need professionally printed copies of all the Arkham Horror community&rsquo;s homebrew content. You can no longer resist; it&rsquo;s time to accept your <strong>Inexorable Fate</strong>.</p></div>'
)

const homeIntro = (
  '<div class="intro w-100 m-auto"><p>Arkham Horror: The Card Game. An innocuous title that caught your eye one day while you were browsing the shelves. “How interesting,” you thought. “Perhaps I’ll buy the core set. Maybe an expansion or two; that will be plenty.”</p><p>Wait…where did all these boxes come from? Why do you have so many? In the blink of an eye, you gaze upon a room piled high with expansions, playmats, and custom tokens.</p><p>But it’s not enough. You have them all now, every scrap of official content, and still that gnawing, aching hunger curdles your stomach. Your collection mocks you in its infinite finitude.</p><p>You know what to do, what you desperately need. Professionally printed copies of all the Arkham Horror community’s home-brewed content! Surely that will sate you. Surely that will be enough.</p><p>Won’t it?</p><p>There’s only one way to find out. It’s time to accept your Inexorable Fate.</p><p><em>If "you reject your fate,"</em> proceed to <a href="/about">Intro 1.</a></p>  <p><em>If "the investigators are uninitiated,"</em> proceed to <a href="/getting-started">Intro 2</a>.</p><p><em>If "you have been here before,"</em> proceed to <a href="#filters">Intro 3.</a></p></div>'
)

export const Intro = () => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
      {homeIntro}
    </ReactMarkdown>
  )
}
