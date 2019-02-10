class Storage {
  getSelectedCountry() {
    return this.getItem('selectedCountry') || ''
  }

  getSelectedCity() {
    return this.getItem('selectedCity') || ''
  }

  setSelectedCountry(country: string) {
    return this.setItem('selectedCoutry', country)
  }

  setSelectedCity(city: string) {
    return this.setItem('selectedCity', city)
  }

  setItem(key: string, value: string) {
    return localStorage.setItem(key, value)
  }

  getItem(key: string) {
    return localStorage.getItem(key)
  }
}

export default Storage
