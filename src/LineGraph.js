import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'

function LineGraph() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log(data)
        })
    }

    fetchData()
  }, [])
  return (
    <div>
      <h2>Graph</h2>
    </div>
  )
}

export default LineGraph
