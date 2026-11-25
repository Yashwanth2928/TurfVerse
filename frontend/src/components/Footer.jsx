
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h2>Turf<span>Verse</span></h2>
        <p>Play. Refresh. Repeat.</p>
      </div>

      <p>Find your ground. Enjoy your game.</p>

      <p className="copyright">
        © {new Date().getFullYear()} TurfVerse. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
