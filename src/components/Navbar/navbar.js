import { Container } from "react-bootstrap"
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hyperlink from '../shared/Hyperlink/Hyperlink'
import './navbar.scss'
import Modal from '@mui/material/Modal';
import { showFullApp } from '../../common/Functions';
import '../Login/Login.scss'
import Login from '../Login/Login';
import logoImg from '../../assets/images/logo_aiPlato-black-h.png'
import menuIcon from '../../assets/images/menu-icon.svg'
import menuCloseIcon from '../../assets/images/menu-close-icon.svg'


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNavExpanded: false,
      isOpen: false,
      loginEmail: '',
      validLoginEmail: false,
      password: '',
      redirectToQue: '',
      sessionId: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isExpanded !== prevProps.isExpanded) {
      this.setState({ isNavExpanded: this.props.isExpanded });
    }
  }
  toggleNav = () => {
    this.setState(prevState => ({
      isNavExpanded: !prevState.isNavExpanded
    }));
  }

  onMenuItemSelection = () => {
    this.setState({ isNavExpanded: false })
  }

  handleOpen = (event) => {
    this.setState({ isOpen: true })
  };

  handleClose = () => {
    this.setState({ isOpen: false })
  };


  render() {
    const { isNavExpanded } = this.state;

    return (

      <div className='container-fluid Nav-Container'>
        <Modal style={{
          position: 'absolute',
          top: '-18%',
          left: '66%',
          justify: 'center'
        }}
          open={this.state.isOpen}
          onClose={this.handleClose}
          aria-describedby="modal-modal-description"
        >
          <Login showHeader={false} />

        </Modal>

        <div>
          <nav className="navbar navbar-expand-xl navbar-light app-nav-pill">
              <a alt="aiPlato" href="/" className="navbar-brand app-brand">
                <img aria-label='' src={logoImg} alt="aiPlato" />
              </a>

              {/* Mobile actions (visible < 1200px) */}
            <div className="app-nav-actions d-xl-none">
              <div className="d-none d-sm-block">
                {showFullApp() ?
                  <a
                    href="/login"
                    onClick={(e) => { e.preventDefault(); this.handleOpen(); }}
                    className="nav-link app-login-btn"
                  >
                    Login
                  </a>
                  :
                  <Link onClick={this.onMenuItemSelection} to="/login" className="nav-link app-login-btn">Login</Link>
                }
              </div>
                <button onClick={this.toggleNav} className="app-nav-toggler--mobile"
                  aria-expanded={isNavExpanded ? "true" : "false"} aria-label="Toggle navigation"
                  type="button">
                  {isNavExpanded ? (
                    <img src={menuCloseIcon} alt="Close menu" className="app-nav-toggler-icon-img" />
                  ) : (
                    <img src={menuIcon} alt="Open menu" className="app-nav-toggler-icon-img" />
                  )}
                </button>
              </div>

              {/* Desktop nav (visible >= 1200px) */}
              <div className="navbar-nav app-nav-links mx-auto d-none d-xl-flex">
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/">Home</Hyperlink>
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/educator">Educators</Hyperlink>
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/team">About Us</Hyperlink>
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/careers">Careers</Hyperlink>
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/contact">Contact Us</Hyperlink>
              </div>
              <div className='navbar-nav app-nav-auth d-none d-xl-flex'>
                  {showFullApp() ?
                    <a
                      href="/login"
                      onClick={(e) => { e.preventDefault(); this.handleOpen(); }}
                      className="nav-link app-login-btn"
                    >
                      Login
                    </a>
                    :
                    <Link onClick={this.onMenuItemSelection} to="/login" className="nav-link app-login-btn">Login</Link>
                  }
              </div>

              {/* Mobile dropdown menu (visible < 1200px) */}
            <div className={isNavExpanded ? "app-mobile-menu app-mobile-menu--open d-xl-none" : "app-mobile-menu d-xl-none"} id="navbarNavAltMarkup">
              <div className="navbar-nav app-nav-links app-nav-links--mobile">
                <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/">Home</Hyperlink>
                <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/educator">Educators</Hyperlink>
                <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/team">About Us</Hyperlink>
                <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/careers">Careers</Hyperlink>
                <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/contact">Contact Us</Hyperlink>
                <div className="d-sm-none">
                  <Hyperlink onLinkClick={this.onMenuItemSelection} type="Link_Primary" className="nav-item" href="/login">Login</Hyperlink>
                </div>
              </div>
            </div>
            </nav>
        </div>

      </div>
    );
  };
}

export default Navigation;
