import React, { useState, useEffect } from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'

import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core'
import numeral from 'numeral'

import { sortData, prettyPrintStat } from './utils'
import './App.css'
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setInputCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [mapCountries, setMapCountries] = useState([])
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            id: country._id,
            name: country.country,
            value: country.countryInfo.iso2,
          }))
          let sortedData = sortData(data)
          setCountries(countries)
          setTableData(sortedData)
          setMapCountries(data)
        })
    }

    getCountriesData()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid 19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format('0.0a')}
          />
          <InfoBox
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format('0.0a')}
          />
          <InfoBox
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format('0.0a')}
          />
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
