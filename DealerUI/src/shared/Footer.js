const config = require('../config/config.json');
 function Footer() {
    return (
        <>
            <footer className="main-footer text-center">
                <strong> &copy; 2024-2025 <a target='_blank' href="https://www.iteos.in/">{config.PoweredBy}</a>.</strong>
                {" "}All rights reserved.
            </footer>
        </>
    );
}

export default Footer;