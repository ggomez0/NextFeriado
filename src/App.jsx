import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

const getURL = year => `https://nolaborables.com.ar/api/v2/feriados/${year}`

function App() {
  const [loading, setLoading] = useState(true)
  const [nextHoliday, setNextHoliday] = useState(null)

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();

    axios.get(getURL(year))
      .then(({ data }) => {
        const nextHoliday = getNextHoliday(data, now);
        setNextHoliday(nextHoliday);
        setLoading(false);
      });
  }, []);

  function getNextHoliday(holidays, currentDate) {
    const nowMonth = currentDate.getMonth() + 1;
    const nowDay = currentDate.getDate();

    let nextHoliday = holidays.find(h => h.mes === nowMonth && h.dia >= nowDay);

    if (!nextHoliday) {
      nextHoliday = holidays[0];
    }

    return nextHoliday;
  }

  function getDifferenceInDays() {
    if (nextHoliday) {
      const now = new Date();
      const nextHolidayDate = new Date(now.getFullYear(), nextHoliday.mes - 1, nextHoliday.dia);
      const differenceInMilliseconds = nextHolidayDate.getTime() - now.getTime();
      const differenceInDays = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      return { name: nextHoliday.motivo, days: differenceInDays, url: nextHoliday.info, tipo: nextHoliday.tipo, dia: nextHoliday.dia, mes: nextHoliday.mes}
    }
    return null;
  }

  function getMonthName(monthNumber) {
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    }

    return null;
  }

  return (
    <div className='container'>
      {loading ? <h1>Cargando...</h1> :
        <>
          <h1>Quedan {getDifferenceInDays().days} días para el próximo feriado</h1>
          <p>Feriado {getDifferenceInDays().tipo} </p>
          <p>{getDifferenceInDays().dia} de {getMonthName(getDifferenceInDays().mes)} - <a href={getDifferenceInDays().url}>{getDifferenceInDays().name}</a> </p>
        </>
      }
    </div>
  );
}

export default App