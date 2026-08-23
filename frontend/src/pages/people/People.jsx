import { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiLock, FiPlus } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import person0 from '../../assets/static/0.png'
import person1 from '../../assets/static/1.png'
import './People.css'

const personImages = {
  0: person0,
  1: person1,
}

function People({ currentPage, people, setCurrentPage, setEditingPersonId }) {
  const cardsPerPage = 3
  const [firstCardIndex, setFirstCardIndex] = useState(0)

  const peopleCards = [...people, { id: 'add-person-card', isAddCard: true }]
  const lastCardIndex = firstCardIndex + cardsPerPage
  const visibleCards = peopleCards.slice(firstCardIndex, lastCardIndex)
  const canGoBack = firstCardIndex > 0
  const canGoForward = lastCardIndex < peopleCards.length

  function getPersonImage(imageId) {
    return personImages[imageId] || personImages[0]
  }

  function formatText(text) {
    if (!text) {
      return ''
    }

    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  function showPreviousCards() {
    const previousIndex = firstCardIndex - cardsPerPage

    if (previousIndex < 0) {
      setFirstCardIndex(0)
      return
    }

    setFirstCardIndex(previousIndex)
  }

  function showNextCards() {
    const nextIndex = firstCardIndex + cardsPerPage

    if (nextIndex < peopleCards.length) {
      setFirstCardIndex(nextIndex)
    }
  }

  function openAddPersonPage() {
    setCurrentPage('add-person')
  }

  function openEditPersonPage(personId) {
    setEditingPersonId(personId)
    setCurrentPage('edit-person')
  }

  return (
    <div className="people-page" id="people">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="people-main">
        <section className="people-intro">
          <h1 className="people-title">People</h1>
          <p className="people-subtitle">
            Keep familiar faces consistent across your illustrated memories.
          </p>

          <button className="people-add-button" onClick={openAddPersonPage} type="button">
            <FiPlus className="people-add-button__icon" />
            <span>Add a person</span>
          </button>
        </section>

        <section className="people-gallery">
          <div className="people-arrow-space">
            {canGoBack && (
              <button className="people-arrow" onClick={showPreviousCards} type="button">
                <FiChevronLeft />
              </button>
            )}
          </div>

          <div className="people-card-grid">
            {visibleCards.map((card) => {
              if (card.isAddCard) {
                return (
                  <button
                    className="person-card person-card--add"
                    key={card.id}
                    onClick={openAddPersonPage}
                    type="button"
                  >
                    <FiPlus className="person-card__plus" />
                    <span>Add someone new</span>
                  </button>
                )
              }

              return (
                <article className="person-card" key={card.id}>
                  <img
                    className="person-card__portrait"
                    src={getPersonImage(card.imageId)}
                    alt={`${formatText(card.name)} portrait`}
                  />
                  <h2 className="person-card__name">{formatText(card.name)}</h2>
                  <p className="person-card__relationship">{formatText(card.relationship)}</p>
                  <p className="person-card__description">{formatText(card.description)}</p>
                  <button
                    className="person-card__edit"
                    onClick={() => openEditPersonPage(card.id)}
                    type="button"
                  >
                    Edit
                  </button>
                </article>
              )
            })}
          </div>

          <div className="people-arrow-space">
            {canGoForward && (
              <button className="people-arrow" onClick={showNextCards} type="button">
                <FiChevronRight />
              </button>
            )}
          </div>
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
