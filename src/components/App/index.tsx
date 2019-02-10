import React, {useState, useEffect} from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import styled from 'styled-components'
import Events from '../Events'
import Preloader from '../Preloader'
import {getEvents} from '../../utils/api'
import Footer from '../Footer'
import Storage from '../../utils/storage'

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 15px;
  position: relative;
`
const Header = styled.h1`
  font-size: 36px;
`
const Search = styled.div`
  margin-bottom: 15px;
`
interface StyledSelectProps {
  clearValueText: string
  noResultsText: string
  multi: boolean
}

const StyledSelect = styled<StyledSelectProps, any>(Select)`
  margin-bottom: 10px;
`

type Props = {
  storage: Storage
}

function App(props: Props) {
  const [entries, setEntries] = useState([])
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState([])
  const [selectedCity, setSelectedCity] = useState([])

  const handleCountrySelect = createCountrySelectHandler()
  const handleCitySelect = createCitySelectHandler()

  const init = async () => {
    const {storage} = props
    let _selectedCountry: any = storage.getSelectedCountry()
    let _selectedCity: any = storage.getSelectedCity()
    try {
      _selectedCountry = JSON.parse(_selectedCountry)
      _selectedCity = JSON.parse(_selectedCity)
    } catch (err) {
      _selectedCountry = []
      props.storage.setItem('selectedCountry', JSON.stringify(_selectedCountry))

      _selectedCity = []
      props.storage.setItem('selectedCity', JSON.stringify(_selectedCity))
    }

    if (typeof _selectedCountry !== 'object') props.storage.setItem('selectedCountry', '[]')
    if (typeof _selectedCity !== 'object') props.storage.setItem('selectedCity', '[]')

    const {entries: _entries, countries: _countries}: {entries: any; countries: any} = await getEvents()

    setLoading(false)
    setEntries(_entries)
    setCountries(_countries)
    setSelectedCountry(_selectedCountry)
    setSelectedCity(_selectedCity)
  }

  useEffect(() => {
    init()
  }, [])

  function removeCity(value: any) {
    const list: any = []
    const cities: any = []
    value.map((item: any) => {
      const s = countries.find(({name}) => name === item.value)
      return list.push(s)
    })
    list.map((item: any) => {
      return item.cities.map((item: any) => {
        return cities.push({value: item, label: item})
      })
    })
    const newSelectedCity: any = []
    cities.map((item: any) => {
      const s = selectedCity.find(({value}) => value === item.value)
      if (s) newSelectedCity.push(s)
      return false
    })
    setSelectedCity(newSelectedCity)
    props.storage.setItem('selectedCity', JSON.stringify(newSelectedCity))
  }

  function createCountrySelectHandler() {
    return (selectedOption: any) => {
      const value = selectedOption ? selectedOption : ''
      setSelectedCountry(value)
    }
  }

  function createCitySelectHandler() {
    return (selectedOption: any) => {
      const value = selectedOption ? selectedOption : ''
      setSelectedCity(value)
    }
  }

  useEffect(
    () => {
      props.storage.setItem('selectedCountry', JSON.stringify(selectedCountry))
      removeCity(selectedCountry)
    },
    [selectedCountry],
  )

  useEffect(
    () => {
      props.storage.setItem('selectedCity', JSON.stringify(selectedCity))
    },
    [selectedCity],
  )

  function renderFooter() {
    return loading ? null : <Footer />
  }

  const countriesList: any = []
  countries.forEach((value: any) => {
    countriesList.push({value: value.name, label: value.name})
  })
  let cities: any = []
  const list: any = []

  let selectedCountries: any = selectedCountry
  let selectedCities: any = selectedCity

  if (selectedCountry.length) {
    selectedCountry.map((item: any) => {
      const country = countries.find(({name}) => name === item.value)
      if (country) list.push(country)
      return false
    })

    if (list.length) {
      list.map((item: any) => {
        return item.cities.map((item: any) => {
          return cities.push({value: item, label: item})
        })
      })
      let checkCity = []
      cities.map((item: any) => {
        const city = selectedCity.find(({value}) => value === item.value)
        if (city) checkCity.push(city)
        return false
      })
      if (!checkCity.length) selectedCities = []
    } else {
      selectedCountries = []
    }
  }

  let citySelect = (
    <StyledSelect
      clearValueText="Очистить"
      placeholder="Выберите город"
      noResultsText="Ничего не найдено"
      name="form-field-city-name"
      options={cities}
      multi
      value={selectedCities}
      onChange={handleCitySelect}
    />
  )
  return (
    <Container>
      <Header>Календарь событий по&nbsp;фронтенду</Header>
      <Search>
        <StyledSelect
          clearValueText="Очистить"
          placeholder="Выберите страну"
          noResultsText="Ничего не найдено"
          name="form-field-country-name"
          options={countriesList}
          multi
          value={selectedCountries}
          onChange={handleCountrySelect}
        />
        {selectedCountries.length ? citySelect : ''}
      </Search>
      {loading ? <Preloader /> : <Events country={selectedCountries} city={selectedCities} entries={entries} />}
      {renderFooter()}
    </Container>
  )
}

export default App
