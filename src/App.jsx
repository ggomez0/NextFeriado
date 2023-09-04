import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const getURL = year => `https://nolaborables.com.ar/api/v2/feriados/${year}`

function App() {
  const [loading, setLoading] = useState(true)
  const [nextHoliday, setNextHoliday] = useState(null)

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()

    axios.get(getURL(year))
      .then(({ data }) => {
        const nextHoliday = getNextHoliday(data, now)
        setNextHoliday(nextHoliday)
        setLoading(false)
      })
  }, [])

  function getNextHoliday (holidays, currentDate) {
    const nowMonth = currentDate.getMonth() + 1
    const nowDay = currentDate.getDate()

    let nextHoliday = holidays.find(h => h.mes >= nowMonth && h.dia >= nowDay)
    console.log('nextHoliday', nextHoliday)

    if (!nextHoliday) {
      nextHoliday = holidays[0]
      console.log('nextHoliday1', nextHoliday)
    }

    return nextHoliday
  }

  function getDifferenceInDays () {
    if (nextHoliday) {
      const now = new Date()
      const nextHolidayDate = new Date(now.getFullYear(), nextHoliday.mes - 1, nextHoliday.dia)
      const differenceInMilliseconds = nextHolidayDate.getTime() - now.getTime()
      const differenceInDays = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24))
      return { name: nextHoliday.motivo, days: differenceInDays, url: nextHoliday.info, tipo: nextHoliday.tipo, dia: nextHoliday.dia, mes: nextHoliday.mes}
    }
    return null
  }

  function getMonthName (monthNumber) {
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]

    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    }
    return null
  }

  function isholidaytoday () {
    const now = new Date()
    const nowMonth = now.getMonth() + 1
    const nowDay = now.getDate()
    const nextHoliday = getNextHoliday()
    return (nextHoliday.dia === nowDay && nextHoliday.mes === nowMonth)
  }

  return (
    <div className='flex flex-col mx-auto min-h-screen items-center justify-center text-center space-y-3'>
      {loading ? <span className="loading loading-spinner loading-lg"></span>:
        <>
          <h1 className="font-bold text-xl md:text-2xl lg:text-3xl xl:text-5xl ">Quedan {getDifferenceInDays().days} días para el próximo feriado</h1>
          <h3 className=''>{getDifferenceInDays().dia} de {getMonthName(getDifferenceInDays().mes)} - <a className='link link-info link-hover' href={getDifferenceInDays().url}>{getDifferenceInDays().name}</a> </h3>
          <p className=''>Feriado {getDifferenceInDays().tipo} </p>
        </>
      }
    </div>
  )
}

export default App