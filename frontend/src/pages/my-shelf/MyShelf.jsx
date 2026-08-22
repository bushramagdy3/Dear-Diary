import { FiPlus } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import './MyShelf.css'

function MyShelf({ currentPage, setCurrentPage }) {
  return (
    <div className="shelf-page" id="my-shelf">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="shelf-main">
        <section className="shelf-intro">
          <h1 className="shelf-title">My shelf</h1>
          <p className="shelf-subtitle">Your diaries live only on this device.</p>

          <div className="shelf-actions">
            <button className="shelf-create" type="button">
              <FiPlus className="shelf-create__icon" />
              <span>Create new diary</span>
            </button>

            <button className="shelf-export" type="button">
              Export all data
            </button>
          </div>
        </section>

        <section className="shelf-empty"></section>
      </main>

      <Footer />
    </div>
  )
}

export default MyShelf
