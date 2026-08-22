import './Footer.css'

const footerLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bushra-magdy-37a9ba417/' },
  { label: 'GitHub', href: 'https://github.com/bushramagdy3' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <nav className="site-footer__links">
        <p className="site-footer__credit">Designed &amp; built by Bushra Magdy</p>
        {footerLinks.map((link) => (
          <a className="site-footer__link" href={link.href} key={link.label}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}

export default Footer
