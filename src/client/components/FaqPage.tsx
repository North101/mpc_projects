import { useCallback, useEffect, useState } from 'react'
import Nav from 'react-bootstrap/Nav'
import { AppContainer } from './AppContainer'
import Accordion from 'react-bootstrap/esm/Accordion'
import { AccordionEventKey } from 'react-bootstrap/esm/AccordionContext'

function* nodeIterator(result: XPathResult) {
  let thisNode = result.iterateNext()
  while (thisNode) {
    yield thisNode
    thisNode = result.iterateNext()
  }
}

export const FaqPage = () => {
  const [hash, setHash] = useState<string>(window.location.hash)

  const onHash = useCallback(() => setHash(window.location.hash), [])
  useEffect(() => {
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const onSelect = (eventKey: AccordionEventKey) => {
    if (typeof eventKey == 'string') {
      setHash(eventKey)
    } else {
      setHash('')
    }
  }

  return (
    <AppContainer>
      <div className='faq tldr w-100 m-auto'>
        <h2 className='display-3'>Frequently Asked Questions</h2>
        <Accordion flush id='faq-accordion' activeKey={hash} onSelect={onSelect}>
          <Accordion.Item eventKey='#why'>
            <Accordion.Header as='h3' id='why'><span>This extension seems like a lot of trouble. Why can&rsquo;t you just provide links to projects on MPC?</span></Accordion.Header>
            <Accordion.Body>
              <p>The extension, and subsequently Inexorable Fate, were created specifically to prevent the problems that come with direct links to MPC projects. MPC was not intended for free sharing of projects; sharable projects were created to be sold in the MPC marketplace for a profit. Members of the Arkham Horror community do not want to violate <a href='https://images-cdn.fantasyflightgames.com/filer_public/fa/b1/fab15a15-94a6-404c-ab86-6a3b0e77a7a0/ip_policy_031419_final_v21.pdf'>FFG&rsquo;s policy for community use of IP</a> by profiting off custom content, so they found a workaround to share MPC projects for free.</p>
              <p>Unfortunately, this meant that any changes to a project changed it not just for the person placing the order but for everyone who viewed it thereafter. Projects were frequently found to be missing cards or have been partially overwritten by another campaign. Some unfortunate fans wasted large sums of money printing projects that turned out to be damaged. And because creating a project on MPC is time-consuming, popular campaigns were often unavailable for months until someone had the time to recreate the project.</p>
              <p>The extension allows projects to be created quickly, ensures that projects can&rsquo;t be accidentally damaged for everyone by someone making their own MPC order, and allows for easy editing and combining of projects, saving you time and, theoretically, money. Although you may find the whole thing so easy that you print twice as much as you would have otherwise.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#utility'>
            <Accordion.Header as='h3' id='utility'><span>If I just want to create my own project files and I&rsquo;m not planning to share them, will I still find the extension useful?</span></Accordion.Header>
            <Accordion.Body>
              <p>Yes! You can save time by uploading images in bulk; the extension will automatically pair fronts and backs based on the filenames. MPC Project Helper then creates a json-formatted project file with links to the already uploaded images.</p>
              <p>As MPC charges less per card as the project size increases, you can also save money by combining several projects into one before printing.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#refresh'>
            <Accordion.Header as='h3' id='refresh'><span>I&rsquo;ve loaded a project from Inexorable Fate to my MPC account, but some of the card images aren&rsquo;t loading. What gives?</span></Accordion.Header>
            <Accordion.Body>
              <p>MPC&rsquo;s image caching expires frequently, and currently can&rsquo;t be refreshed automatically. If the images aren&rsquo;t loading, <a href='/faq#contact'>contact us</a> (Discord is recommended for fastest support) and someone can refresh it for you.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#bleed'>
            <Accordion.Header as='h3' id='bleed'><span>I&rsquo;ve uploaded cards with bleed but the red dotted line for MPC&rsquo;s &ldquo;safe area&rdquo; still shows parts of my cards cut off. Should I worry?</span></Accordion.Header>
            <Accordion.Body>
              <p>The red dotted lines indicating the safe print area may seem concerning, as sometimes part of the card title or other important elements may fall outside this line. However, this is an unlikely worst case scenario on any given edge of the card.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#submit'>
            <Accordion.Header as='h3' id='submit'><span>I created an Arkham Horror homebrew campaign/investigator expansion/other cool card bling. How can I get my project included on Inexorable Fate for others to print?</span></Accordion.Header>
            <Accordion.Body>
              <p>Coldtoes would love to help make your project available for print! <a href='/faq#contact'>Contact her</a> and share your cards and she&rsquo;ll make a project for the site. (If you make the project yourself, someone will have to contact you to refresh it whenever they want to print it, so we&rsquo;ve found it&rsquo;s easiest to have most projects for public use on a single account.)</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#sites'>
            <Accordion.Header as='h3' id='sites'><span>Does the extension work with card printing sites other than MPC?</span></Accordion.Header>
            <Accordion.Body>
              <p>Yes. The extension also runs on <a href='https://printerstudio.com/'>PrinterStudio.com</a>, <a href='https://printerstudio.co.uk/'>PrinterStudio.co.uk</a>, and <a href='https://printerstudio.com.hk/'>PrinterStudio.com.hk</a>.</p>
              <p>Unfortunately the projects on Inexorable Fate are only compatible with MPC. If you need projects for other sites, <a href='/faq#contact'>contact Coldtoes</a> for assistance.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#modal'>
            <Accordion.Header as='h3' id='modal'><span>What&rsquo;s up with the homepage splash screen? Don&rsquo;t you know people hate those?</span></Accordion.Header>
            <Accordion.Body>
              <p>Yes, but once I had the idea in my head for that act card, I couldn&rsquo;t resist it. Just check the <strong>Don&rsquo;t show again</strong> box at the bottom and you won&rsquo;t see it again.</p>
              <p>Besides, this is Arkham Horror. You&rsquo;re not going to like everything that happens to you.</p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey='#contact'>
            <Accordion.Header as='h3' id='contact'><span>What should I do if I need help, find an error in one of the posted projects, or have suggestions to improve these instructions? How can I contact the amazing team behind Inexorable Fate?</span></Accordion.Header>
            <Accordion.Body>
              <ol>
                <li>You can report bugs, request new features, suggest documentation improvements, or let us know about new/changed projects by <a href="https://github.com/North101/mpc_projects/issues/new">filing an issue on Github.</a></li>
                <li>Not a GitHub person? Or just need someone to refresh a project? There&rsquo;s a dedicated <a href="https://discord.com/channels/225349059689447425/1192620482168635523">forum section</a> for Inexorable Fate and the MPC Project Helper Mythos Busters Discord server. Find us there for support or dev chat.</li>
                <li>That&rsquo;s still not what you were hoping for? You can also find Coldtoes (she/her), in rough order of preference, as <strong>@coldtoes</strong> on the Mythos Busters Discord server in the above-mentioned dev forum or the <strong>#bling-your-game channel</strong>, as <a href='https://discord.com/users/10coldtoes'>10coldtoes</a> through Discord DM, as <a href='https://www.reddit.com/user/coldt0es'>u/coldt0es</a> on <a href='https://www.reddit.com/r/arkhamhorrorlcg/'>r/arkhamhorrorlcg</a>, and as <a href='https://boardgamegeek.com/user/coldtoes'>coldtoes</a> on BoardGameGeek.</li>
              </ol>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </AppContainer>
  )
}
