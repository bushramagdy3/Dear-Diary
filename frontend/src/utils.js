const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatDate(day, month, year) {
  const monthNumber = Number(month)

  if (Number.isNaN(monthNumber)) {
    return `${day} ${month} ${year}`
  }

  return `${day} ${monthNames[monthNumber - 1]} ${year}`
}

export function formatPeopleForRequest(people) {
  const requestPeople = []

  for (let index = 0; index < people.length; index++) {
    const person = people[index]
    let personId = Number(person.id)
    requestPeople.push({
      id: personId,
      name: person.name || '',
      relationship: person.relationship || '',
      is_user: Boolean(person.is_user),
      image: person.imageId ? String(person.imageId) : '',
    })
  }

  return requestPeople
}
