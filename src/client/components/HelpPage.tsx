import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { AppContainer } from './AppContainer'
import Nav from 'react-bootstrap/Nav'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import Accordion from 'react-bootstrap/Accordion';


const useFetch = () => {
  const [data, setData] = useState<string | undefined>()

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch('/assets/help.md')
      setData(await r.text())
    }

    fetchData()
  }, [])

  return data
}

const SideNav = () => {
  return (
    <Nav as='ul' className="flex-column">
      <Nav.Item as='li'>Getting Started
        <Nav as='ul' className="flex-column">
          <Nav.Item as='li'>
            <Nav.Link href="#install">Installing the Chrome Extension</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#next-steps">Next Steps</Nav.Link>
          </Nav.Item>
        </Nav>
      </Nav.Item>
      <Nav.Item as='li'>Find Projects
        <Nav as='ul' className="flex-column">
          <Nav.Item as='li'>
            <Nav.Link href="#download">Downloading a Project</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#search">Using Project Search</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#filter">Filtering Projects</Nav.Link>
          </Nav.Item>
        </Nav>
      </Nav.Item>
      <Nav.Item as='li'>Load a Project
        <Nav as='ul' className="flex-column">
          <Nav.Item as='li'>
            <Nav.Link href="#project-tab">Loading the Project from a .json file</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#project-tab">Combining and Editing Projects (Optional)</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#finalize">Finalizing and Uploading Your Project</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#view-on-mpc">Viewing Your Project on MPC</Nav.Link>
          </Nav.Item>
        </Nav>
      </Nav.Item>
      <Nav.Item as='li'>Create a Project
        <Nav as='ul' className="flex-column">
          <Nav.Item as='li'>
            <Nav.Link href="#image-prep">Preparing Images for Upload</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#image-upload">Uploading Images</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#creator-combine-edite">Combining and Editing Projects (Optional)</Nav.Link>
          </Nav.Item>
          <Nav.Item as='li'>
            <Nav.Link href="#creator-view">Viewing Your Project on MPC</Nav.Link>
          </Nav.Item>
        </Nav>
      </Nav.Item>
      <Nav.Item as='li'>FAQ
        <Nav as='ul' className="flex-column">
          <Nav.Item as='li'>
            <Nav.Link href="#faq">Frequently Asked Questions</Nav.Link>
          </Nav.Item>
        </Nav>
      </Nav.Item>
    </Nav>
  )
}

export const HelpPage = () => {
  const data = useFetch()
  return (
    <AppContainer>
      <Row className='gx-5'>
        <aside className='col-md-3'>
          <SideNav></SideNav>
        </aside>
        <div className='tldr col-md-9'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {data ?? ''}
          </ReactMarkdown>

          <section id='faq'>
            <h2 className='display-4'>Frequently Asked Questions</h2>
            <Accordion flush id='faq-accordion'>
              <Accordion.Item eventKey='why'>
                <Accordion.Header as='h3' id='why'><span>This extension seems like a lot of trouble. Why can&rsquo;t you just provide links to projects on MPC?</span></Accordion.Header>
                <Accordion.Body>
                  <p>The extension, and subsequently Inexorable Fate, were created specifically to prevent the problems that come with direct links to MPC projects. MPC was not intended for free sharing of projects; sharable projects were created to be sold in the MPC marketplace for a profit. Members of the Arkham Horror community do not want to violate <a href="https://images-cdn.fantasyflightgames.com/filer_public/fa/b1/fab15a15-94a6-404c-ab86-6a3b0e77a7a0/ip_policy_031419_final_v21.pdf">FFG&rsquo;s policy for community use of IP</a> by profiting off custom content, so they found a workaround to share MPC projects for free.</p>
                  <p>Unfortunately, this meant that any changes to a project changed it not just for the person placing the order but for everyone who viewed it thereafter. Projects were frequently found to be missing cards or have been partially overwritten by another campaign. Some unfortunate fans wasted large sums of money printing projects that turned out to be damaged. And because creating a project on MPC is time-consuming, popular campaigns were often unavailable for months until someone had the time to recreate the project.</p>
                  <p>The extension allows projects to be created quickly, ensures that projects can&rsquo;t be accidentally damaged for everyone by someone making their own MPC order, and allows for easy editing and combining of projects, saving you time and, theoretically, money. Although you may find the whole thing so easy that you print twice as much as you would have otherwise.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='utility'>
                <Accordion.Header as='h3' id='utility'><span>If I just want to create my own project files and I&rsquo;m not planning to share them, will I still find the extension useful?</span></Accordion.Header>
                <Accordion.Body>
                  <p>Yes! You can save time by uploading images in bulk; the extension will automatically pair fronts and backs based on the filenames. MPC Project Helper then creates a json-formatted project file with links to the already uploaded images.</p>
                  <p>As MPC charges less per card as the project size increases, you can also save money by combining several projects into one before printing.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='bleed'>
                <Accordion.Header as='h3' id='bleed'><span>I&rsquo;ve uploaded cards with bleed but the red dotted line for MPC&rsquo;s &ldquo;safe area&rdquo; still shows parts of my cards cut off. Should I worry?</span></Accordion.Header>
                <Accordion.Body>
                  <p>The red dotted lines indicating the safe print area may seem concerning, as sometimes part of the card title or other important elements may fall outside this line. However, this is an unlikely worst case scenario on any given edge of the card.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='submit'>
                <Accordion.Header as='h3' id='submit'><span>I created an Arkham Horror homebrew campaign/investigator expansion/other cool card bling. How can I get my project included on Inexorable Fate for others to print?</span></Accordion.Header>
                <Accordion.Body>
                  <p>Coldtoes would love to help make your project available for print! <a href="#contact">Contact her</a> and share your cards and she&rsquo;ll make a project for the site. (If you make the project yourself, someone will have to contact you to refresh it whenever they want to print it, so we&rsquo;ve found it&rsquo;s easiest to have most projects for public use on a single account.)</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='sites'>
                <Accordion.Header as='h3' id='sites'><span>Does the extension work with card printing sites other than MPC?</span></Accordion.Header>
                <Accordion.Body>
                  <p>Yes. The extension also runs on <a href="http://printerstudio.com/">PrinterStudio.com</a>, <a href="http://printerstudio.co.uk/">PrinterStudio.co.uk</a>, and <a href="http://printerstudio.com.hk/">PrinterStudio.com.hk</a>.</p>
                  <p>Unfortunately the projects on Inexorable Fate are only compatible with MPC. If you need projects for other sites, <a href="#contact">contact Coldtoes</a> for assistance.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='modal'>
                <Accordion.Header as='h3' id='modal'><span>What&rsquo;s up with the homepage splash screen? Don&rsquo;t you know people hate those?</span></Accordion.Header>
                <Accordion.Body>
                  <p>Yes, but once I had the idea in my head for that act card, I couldn&rsquo;t resist it. Just check the <strong>Don&rsquo;t show again</strong> box at the bottom and you won&rsquo;t see it again.</p>
                  <p>Besides, this is Arkham Horror. You&rsquo;re not going to like everything that happens to you.</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='contact'>
                <Accordion.Header as='h3' id='contact'><span>Who should I contact if I need help, find an error in one of the posted projects, or have suggestions to improve these instructions?</span></Accordion.Header>
                <Accordion.Body>
                  <p>Coldtoes (she/her) can be found (in rough order of preference) as <strong>@coldtoes</strong> on the MythosBusters Discord server in the <strong>#bling-your-game channel</strong>, as <a href="https://discord.com/users/10coldtoes">10coldtoes</a> through Discord DM, as <a href="https://www.reddit.com/user/coldt0es">u/coldt0es</a> on <a href="https://www.reddit.com/r/arkhamhorrorlcg/">r/arkhamhorrorlcg</a>, and as <a href="https://boardgamegeek.com/user/coldtoes">coldtoes</a> on BoardGameGeek.</p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </section>
        </div>
      </Row>
    </AppContainer>
  )
}
