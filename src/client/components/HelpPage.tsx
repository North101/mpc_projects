import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/esm/Row';
import { AppContainer } from './AppContainer';
import { HelpText } from './HelpText';
import { FAQ } from './FAQ';


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
  return (
    <AppContainer>
      <Row className='gx-5'>
        <aside className='col-md-3'>
          <SideNav></SideNav>
        </aside>
        <div className='tldr col-md-9'>
          <HelpText />
          <FAQ />
        </div>
      </Row>
    </AppContainer>
  )
}
