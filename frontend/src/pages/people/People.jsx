import { FiLock, FiPlus } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import './People.css'

function People({ currentPage, setCurrentPage }) {
  return (
    <div className="people-page" id="people">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="people-main">
        <section className="people-intro">
          <h1 className="people-title">People</h1>
          <p className="people-subtitle">
            Keep familiar faces consistent across your illustrated memories.
          </p>

          <button className="people-add-button" type="button">
            <FiPlus className="people-add-button__icon" />
            <span>Add a person</span>
          </button>
        </section>

        <section className="people-card-grid">
          <button className="person-card person-card--add" type="button">
            <FiPlus className="person-card__plus" />
            <span>Add someone new</span>
          </button>
        </section>

        <p className="people-privacy">
          <FiLock className="people-privacy__icon" />
          <span>Photos and character cards stay on this device.</span>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default People
