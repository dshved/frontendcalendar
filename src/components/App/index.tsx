import * as React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import styled from 'styled-components'
import Events from '../Events'
import Preloader from '../Preloader'
import {getEvents} from '../../utils/api'
import Footer from '../Footer'

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

class App extends React.Component<any, any> {
  state = {
    entries: [],
    countries: [],
    filter: '',
    type: '',
    selectedOption: '',
    loading: true,
    selectedCountry: [],
    selectedCity: [],
  }
  handleCountrySelect: any
  handleCitySelect: any

  constructor(props: any) {
    super(props)

    this.handleCountrySelect = this.createCountrySelectHandler()
    this.handleCitySelect = this.createSelectHandler('selectedCity')
  }

  componentDidMount = async () => {
    const {storage} = this.props
    let selectedCountry = storage.getSelectedCountry()
    let selectedCity = storage.getSelectedCity()
    try {
      selectedCountry = JSON.parse(selectedCountry)
      selectedCity = JSON.parse(selectedCity)
    } catch (err) {
      selectedCountry = []
      this.props.storage.setItem('selectedCountry', JSON.stringify(selectedCountry))

      selectedCity = []
      this.props.storage.setItem('selectedCity', JSON.stringify(selectedCity))
    }

    if (typeof selectedCountry !== 'object') this.props.storage.setItem('selectedCountry', '[]')
    if (typeof selectedCity !== 'object') this.props.storage.setItem('selectedCity', '[]')

    const {entries, countries} = await getEvents()
    this.setState({
      loading: false,
      entries,
      countries,
      selectedCountry,
      selectedCity,
    })
  }

  createSelectHandler(stateProperty: any) {
    return (selectedOption: any) => {
      const value = selectedOption ? selectedOption : ''
      this.setState(
        {
          [stateProperty]: value,
        },
        () => {
          this.props.storage.setItem(stateProperty, JSON.stringify(value))
          if (stateProperty === 'selectedCountry') {
            this.removeCity(value)
          }
        },
      )
    }
  }
  removeCity = (value: any) => {
    const {countries, selectedCity} = this.state
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
    this.setState({selectedCity: newSelectedCity})
    this.props.storage.setItem('selectedCity', JSON.stringify(newSelectedCity))
  }

  createCountrySelectHandler() {
    const generalPropHandler = this.createSelectHandler('selectedCountry')
    return (selectedOption: any) => {
      generalPropHandler(selectedOption)
    }
  }
  renderFooter = () => {
    const {loading} = this.state

    return loading ? null : <Footer />
  }
  render() {
    const {countries, selectedCountry, selectedCity, loading, entries} = this.state
    const countriesList: any = []
    countries.forEach((value: any) => {
      countriesList.push({value: value.name, label: value.name})
    })
    let cities: any = []
    const list: any = []

    let selectedCountries = selectedCountry
    let selectedCities = selectedCity

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
        onChange={this.handleCitySelect}
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
            onChange={this.handleCountrySelect}
          />
          {selectedCountries.length ? citySelect : ''}
        </Search>
        {loading ? <Preloader /> : <Events country={selectedCountries} city={selectedCities} entries={entries} />}
        {this.renderFooter()}
      </Container>
    )
  }
}

export default App
