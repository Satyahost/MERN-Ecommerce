import React from 'react';
import { Phone ,Mail, GitHub, LinkedIn, YouTube, Instagram} from '@mui/icons-material'
import XIcon from '@mui/icons-material/X';
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
                <a href="https://github.com/Satyahost" target='_blank'>
                <GitHub className='social-icon'/>
                </a>
                
                <a href="https://www.linkedin.com/in/satyam-kumar-209597323/" target='_blank'>
                <LinkedIn className='social-icon' />
                </a>

                <a href="https://x.com/SATYAYDV65" target='_blank'>
                <XIcon className='social-icon' />
                </a>

                <a href="" target='_blank'>
                <Instagram className='social-icon' />
                </a>
                      
                
            </div>
        </div>
        
        {/*section3*/}
        <div className="footer-section about">
            <h3>About</h3>
                <p>Aspiring Full Stack Developer | Crafting real-world MERN applications & passionate about Machine Learning</p>
        </div>
       </div>
    <div className="footer-bottom">
        <p>&copy; 2026 SatyaEcart . All rights reserved</p>
    </div>

   </footer>
  )
}

export default Footer
