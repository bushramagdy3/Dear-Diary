import anonymousFigure from '../../assets/add-person/portrait-anonymous-figure.png'

function formatText(text) {
    if (!text) {
        return ''
    }

    return text.charAt(0).toUpperCase() + text.slice(1)
}

function PersonCard({card, setEditingPersonId, deleteCurrentPerson, setCurrentPage}){
    function openEditPersonPage(personId) {
        setEditingPersonId(personId)
        setCurrentPage('edit-person')
    }

    return (
        <article className="person-card" key={card.id}>
            <img
            className="person-card__portrait"
            src={card.portraitBlob ? URL.createObjectURL(card.portraitBlob): anonymousFigure}
            alt={`${formatText(card.name)} portrait`}
            />
            <h2 className="person-card__name">{formatText(card.name)}</h2>
            <p className="person-card__relationship">{formatText(card.relationship)}</p>
            <p className="person-card__description">{formatText(card.description)}</p>
            <div className="person-card__actions">
            <button
                className="person-card__edit"
                onClick={() => openEditPersonPage(card.id)}
                type="button"
            >
                Edit
            </button>
            <button
                className="person-card__delete"
                onClick={() => deleteCurrentPerson(card.id)}
                type="button"
            >
                Delete
            </button>
            </div>
        </article>
    )
}

export default PersonCard
