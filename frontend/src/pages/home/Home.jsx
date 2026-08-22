import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import { FiLock } from 'react-icons/fi'
import './Home.css'

function Home({ currentPage, setCurrentPage }) {
  return (
    <div className="home-page" id="home">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="home-hero">
        <section className="home-hero__content">
          <h1 className="home-hero__title">
            <span>Turn ordinary</span>
            <span>days into</span>
            <em>illustrated</em>
            <span>memories.</span>
          </h1>

          <p className="home-hero__copy">
            Write privately. Illustrate the
            moments worth remembering.
          </p>

          <div className="home-hero__actions">
            <a className="home-button home-button--primary" href="#create-diary">
              Create diary
            </a>
            <a className="home-button home-button--secondary" href="#import-backup">
              Import backup
            </a>
          </div>

          <p className="home-hero__privacy">
            <FiLock className="home-hero__lock" />
            <span>Stored only on this device.</span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
