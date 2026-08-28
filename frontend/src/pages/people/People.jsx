import { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiLock, FiPlus } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import './People.css'
import PersonCard from '../../components/personCard/PersonCard'

function People({ appData, currentPage, people, setAppData, setCurrentPage, setEditingPersonId }) {
  const cardsPerPage = 3
  const [firstCardIndex, setFirstCardIndex] = useState(0)

  const peopleCards = [...people, { id: 'add-person-card', isAddCard: true }]
  const lastCardIndex = firstCardIndex + cardsPerPage
  const visibleCards = peopleCards.slice(firstCardIndex, lastCardIndex)
  const canGoBack = firstCardIndex > 0
  const canGoForward = lastCardIndex < peopleCards.length


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

  function deleteCurrentPerson(personId) {
    const updatedAppData = {
      ...appData,
      people: appData.people.filter((person) => person.id !== personId),
    }

    setAppData(updatedAppData)
    setEditingPersonId(null)

    if (visibleCards.length === 1 && canGoBack) {
      showPreviousCards()
    }
  }

  return (
    <div className="people-page" id="people">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} appData={appData}/>

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
                <PersonCard 
                  key={card.id}
                  className="person-card" 
                  card={card} 
                  setEditingPersonId={setEditingPersonId}
                  deleteCurrentPerson={deleteCurrentPerson}
                  setCurrentPage={setCurrentPage}
                />
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
