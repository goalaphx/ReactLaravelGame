import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp, faTwitter } from '@fortawesome/free-brands-svg-icons';
import './Footer.css'; // Adjust the path according to your project structure

const Footer = () => {
    return (
        <footer className="footer mt-auto py-3 bg-dark text-light">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5>Contact Information</h5>
                        <p><FontAwesomeIcon icon={faEnvelope} /> Email: gamehubbusiness@gmail.com</p>
                        <p><FontAwesomeIcon icon={faPhone} /> Phone: +212689488850</p>
                        <p><FontAwesomeIcon icon={faMapMarkerAlt} /> Address: Tiznit, Morocco</p>
                    </div>
                    <div className="col-md-6">
                        <h5>Follow Us</h5>
                        <a href="#"><FontAwesomeIcon icon={faFacebook} className="fa-lg text-light icon-spacing" /></a>
                        <a href="#"><FontAwesomeIcon icon={faInstagram} className="fa-lg text-light icon-spacing" /></a>
                        <a href="#"><FontAwesomeIcon icon={faWhatsapp} className="fa-lg text-light icon-spacing" /></a>
                        <a href="#"><FontAwesomeIcon icon={faTwitter} className="fa-lg text-light icon-spacing" /></a>
                    </div>
                </div>
                <hr className="bg-light" />
                <p className="text-light">Created By: Id Lahcen El Mahdi</p>
                <p className="text-light">&copy; 2024 GameHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
