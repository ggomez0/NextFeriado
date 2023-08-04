import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getURL = year => `https://nolaborables.com.ar/api/v2/feriados/${year}`;

function App() {
  const [loading, setLoading] = useState(true);
  const [nextHoliday, setNextHoliday] = useState(null);

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
      return differenceInDays;
    }
    return null;
  }

  return (
    <div>
      {loading ? <h1>Loading...</h1> :
        <h1>Quedan {getDifferenceInDays()} días para el próximo feriado</h1>
      }
    </div>
  );
}

export default App;
