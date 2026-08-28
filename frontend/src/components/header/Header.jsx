import './Header.css'
import { serializeForBackup } from '../../utils'

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'My Shelf', page: 'my-shelf' },
  { label: 'People', page: 'people' },
  { label: 'How It Works', page: 'how-it-works' },
]

function Header({ currentPage, setCurrentPage, appData}) {
  async function handleExport(){
    const backup = await serializeForBackup(appData)
    const json = JSON.stringify(backup)
    const fileBlob = new Blob([json], {type: "application/json"})
    const url = URL.createObjectURL(fileBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "dear-diary-backup.json"
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <header className="site-header">
      <a className="site-header__brand" href="#home">
        Dear Diary
      </a>

      <nav className="site-header__nav">
        {navItems.map((item) => {
          const isCurrentPage = currentPage === item.page

          return (
            <button
              className={`site-header__link ${isCurrentPage ? 'site-header__link--current' : ''}`}
              disabled={isCurrentPage}
              key={item.label}
              onClick={() => setCurrentPage(item.page)}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </nav>

      <a className="site-header__backup" onClick={handleExport}>
        Export Data
      </a>
    </header>
  )
}

export default Header
