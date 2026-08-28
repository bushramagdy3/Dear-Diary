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

export function blobToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export function formatPeopleForRequest(people) {
  const requestPeople = []

  for (let index = 0; index < people.length; index++) {
    const person = people[index]
    let personId = person.id
    requestPeople.push({
      id: personId,
      name: person.name || '',
      relationship: person.relationship || '',
      is_user: Boolean(person.is_user) || person.relationship === 'user',
      portraitBlob: person.portraitBlob
    })
  }

  return requestPeople
}

export async function serializeForBackup(value) {
    if (value instanceof Blob) {
        const base64 = await blobToBase64(value)

        return {
            __type: "Blob",
            mimeType: value.type,
            data: base64
        }
    }

    if (Array.isArray(value)) {
        return Promise.all(
            value.map(item => serializeForBackup(item))
        )
    }

    if (value && typeof value === "object") {
        const result = {}

        for (const [key, item] of Object.entries(value)) {
            result[key] = await serializeForBackup(item)
        }

        return result
    }

    return value
}
