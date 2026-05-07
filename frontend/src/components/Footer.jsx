import React from 'react';
import { Phone ,Mail, GitHub, LinkedIn, YouTube, Instagram} from '@mui/icons-material'
import '../componentStyles/Footer.css'

const Footer=() => {
  return (
   <footer className='footer'>
    <div className='footer-container'>
        {/*section1*/}
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone: +9508929098</p>
            <p><Mail fontSize='small'/>Email: satyamkumar362005@gmail.com</p>
        </div>

        {/*section2*/}
        <div className="footer-section social">
            <h3>Follow me</h3>
            <div className='social-links'>
                <a href="" target='_blank'>
                <GitHub className='socila-icon'/>
                </a>
                
                <a href="" target='_blank'>
                <LinkedIn className='socila-icon' />
                </a>

                <a href="" target='_blank'>
                <YouTube className='socila-icon' />
                </a>

                <a href="" target='_blank'>
                <Instagram className='socila-icon' />
                </a>
                      
                
            </div>
        </div>
        
        {/*section3*/}
        <div className="footer-section about">
            <h3>About</h3>
            <p>full stack web developer working on real life project and also intrested in machine learning</p>
        </div>
       </div>
    <div className="footer-bottom">
        <p>&copy; 2026 SatyaEcart . All rights reserved</p>
    </div>

   </footer>
  )
}

export default Footer
