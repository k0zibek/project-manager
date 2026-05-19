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
        <a className="notfound-link" href="/">home</a>
        <span>&nbsp;|&nbsp;</span>
        <a className="notfound-link" href="/login">login</a>
      </nav>
    </div>
  </div>
);
