import axios from 'axios'

export const sortStrings = (a: string, b: string): number => {
  const upperA = a.toUpperCase()
  const upperB = b.toUpperCase()
  if (upperA < upperB) {
    return -1
  }
  if (upperA > upperB) {
    return 1
  }
  return 0
}

class Countries {
  countries: {[propName: string]: any} = {}

  addLocation({city, country}: {city: string; country: string}) {
    const countryEntry = this.countries[country] || {cities: new Set()}
    countryEntry.cities.add(city)
    this.countries[country] = countryEntry
  }

  asArray() {
    return Object.keys(this.countries)
      .map(countryName => {
        return {
          name: countryName,
          cities: Array.from(this.countries[countryName].cities).sort(),
        }
      })
      .sort((countryA, countryB) => {
        return sortStrings(countryA.name, countryB.name)
      })
  }
}

interface Event {
  name: string
  city: string
  date: string
  time: string
  link: string
}
export const getEvents = async () => {
  const response = await axios.get('https://frontendcalendar.tk/events')
  const {data} = response
  const entries: any[] = []
  const countries = new Countries()
  data.forEach((el: Event) => {
    const {name, city, date, time, link} = el
    const dateStart = date.split('-')[0]
    const d = dateStart.split('.')
    const more = Date.parse(`${d[2]}-${d[1]}-${d[0]}`) >= new Date().setHours(0, 0, 0, 0)
    if (more) {
      const location = city.replace(/, /g, ',').split(',')
      const locationObj = {
        city: location[0],
        country: location[1],
      }
      countries.addLocation(locationObj)
      const dateEnd = date ? date.split('-')[1] : ''
      const timeStart = time ? time.split('-')[0] : ''
      const timeEnd = time ? time.split('-')[1] : ''
      entries.push({
        name,
        location: locationObj,
        date: {
          start: dateStart,
          end: dateEnd,
        },
        link,
        time: {
          start: timeStart,
          end: timeEnd,
        },
      })
    }
  })
  return {entries, countries: countries.asArray()}
}
