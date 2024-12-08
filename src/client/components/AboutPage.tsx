import { AppContainer } from './AppContainer'

export const AboutPage = () => (
  <AppContainer displayAnnouncements={false}>
    <div className='about tldr w-100 m-auto'>
      <h1 className='display-3'>About Inexorable Fate</h1>
      <p className='lead'>Inexorable Fate is a site to streamline finding and professionally printing custom content for Arkham Horror: The Card Game and official print-and-play AHLCG content released by Fantasy Flight Games (FFG). Using the project files hosted here requires the <a href='https://chrome.google.com/webstore/detail/mpc-project-helper/oigcfklkajlgkeblpngmbgjniiejabko'>MPC Project Helper</a>, a Chrome extension to streamline the creation and sharing of projects on <a href='https://www.makeplayingcards.com/'>MakePlayingCards.com</a> (MPC).</p>

      <h2 id='why'>History</h2>
      <p>It started with the purchase of a single Arkham Horror core set. Before long it had ballooned into owning all the official content and the desperate need to experience all the custom content as well. And like most of you, we just wanted an easier way to get professionally printed copies of the the fabulous homebrew content created by the Arkham Horror community.</p>
      <p>North101 created the MPC Project Helper Chrome extension both to streamline the project creation process and to make projects sharable without the potential to accidentally break the original project.</p>
      <p>Coldtoes volunteered to test the extension; loved it; appointed herself its evangelist; and began maintaining a repository of projects on a Google Drive. North saw the potential in making the projects searchable and filterable, and Inexorable Fate (a.k.a. &ldquo;The North and Coldtoes Next Gen Bling Generator&rsquo;) was born.</p>

      <h2>Credits</h2>
      <p>Inexorable Fate is brought to you by:</p>
      <ul className='list-unstyled'>
        <li>
          <h4>North101</h4>
          <p>Conception, Chrome extension development, site development, project refresh script</p>
        </li>
        <li>
          <h4>Coldtoes</h4>
          <p>Site design and additional development, evangelism, project file maintenance, and support</p>
        </li>
      </ul>

      <h3>Special Thanks</h3>
      <p>This entire enterprise relies on the work of many others, so we&rsquo;d like to thank:</p>
      <ul className='list-unstyled thanks'>
        <li><a href='https://strengthinnumbersarkham.wordpress.com/'>ElseWhere</a>, for the eldritch wordsmithing of the intro.</li>
        <li><a href='https://github.com/Antimarkovnikov/AHC/wiki'>Antimarkovnikov</a>, for advice and enthusiasm.</li>
        <li><strong>Buteremelse</strong>, for accountability check-ins, rubber ducking, and <s>generally being a huge distraction</s> unflagging moral support.</li>
        <li><strong>Soul Turtle</strong>, for the kick in the pants.</li>
        <li>Beta testers <strong>dernincitrus</strong> (accessibility and more), <strong>Ektheleon</strong> (is it Excel enough?), <strong>Moruna</strong>, <strong>SecretGarden</strong>, and <strong>Stormy</strong> &ldquo;Nested Checkboxes&rdquo; <strong>Waters</strong>.</li>
        <li>The entire AHLCG homebrew community, for making all of this necessary with the incredibly high quality custom content they produce.</li>
        <li><strong>JaqenZann</strong>, for the years of tireless effort to enable homebrewers to bring their visions to life.</li>
        <li><strong>MickeyTheQ</strong>, for building Zoop features to make it easier for homebrewers to make PnP versions of their content, and making it easier for us to bring that content to you.</li>
        <li><a href='https://mythosbusters.com/'>Mythos Busters</a>, for bringing us all together</li>
        <li>Developers <strong>Maxine Newman</strong>, <strong>Duke!! Harrist</strong>, <strong>Nick Kory</strong>, <strong>Waleed Ma&rsquo;arouf</strong>, and everyone who works or has worked to bring us this amazing gift that is Arkham Horror: The Card Game.</li>
      </ul>

      <div className='footnote'>
        <h3 className='h5'>Disclaimer</h3>
        <p>Arkham Horror: The Card Game is the intellectual property of Fantasy Flight Games. We at Inexorable Fate make every effort to ensure that the content offered here is in compliance with FFG&rsquo;s policy regarding fair use of IP. This website is not affiliated with FFG.</p>
      </div>
    </div>
  </AppContainer>
)
