import React, { useState, useEffect } from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import './App.css'
function App() {
  const [countries, setCountries] = useState([])
  const [country, setInputCountry] = useState('worldwide')
  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }))
          setCountries(countries)
        })
    }

    getCountriesData()
  }, [])

  const onCountryChange = (e) => {
    setInputCountry(e.target.value)
  }

  return (
    <div className='App'>
      <div className='app__header'>
        <h1>Covid 19 Tracker</h1>
        <FormControl className='app__dropdown'>
          <Select variant='outlined' onChange={onCountryChange} value={country}>
            <MenuItem value='worldwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='app__stats'>
        <InfoBox title='Coronavirus Cases' cases={3000} total={20000} />
        <InfoBox title='Coronavirus Cases' cases={3000} total={20000} />
        <InfoBox title='Coronavirus Cases' cases={3000} total={20000} />
      </div>

      <Map />
    </div>
  )
}

export default App
