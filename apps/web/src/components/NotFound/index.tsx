import { Link } from 'react-router-dom';

/** 404 page with router links */
export const NotFound = () => (
  <div className="notfound-container">
    <div className="notfound-content">
      <h1 className="notfound-title">
        <span className="notfound-title-span">404 - Not found</span>
      </h1>

      <p>An error has occured, to continue:</p>
      <p className="notfound-text">
        * Check if ulr is right.
        <br />
        * Return to our homepage.
        <br />
        * Or return to login page.
      </p>

      <nav className="notfound-nav">
        <Link className="notfound-link" to="/">home</Link>
        <span>&nbsp;|&nbsp;</span>
        <Link className="notfound-link" to="/login">login</Link>
      </nav>
    </div>
  </div>
);
