import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

function App() {

  // let remainedTime
  const options = ["11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "19:30"]
  const [value, setValue] = useState(dayjs())
  const [availableTime, setAvailableTime] = useState([]);
  const [restockTime, setRestockTime] = useState([]);

  const fetchData = async (queryDate) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Basic RGx5SWtwRHJtbHd3Q3lUQ0FLNXpSbitNNDFCTzBoS050ODN4OS9yVm8vclNLRmxDOTRTYURicmdyczdUa2t5b0xyUjlrM0UzUlVFPQ==");
      myHeaders.append("Cookie", "JSESSIONID=node0baq2q3668zvejyqjpz47x2y59128.node0");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      const response = await fetch(`https://ap11.ragic.com/thesunalley/for-testing/23?PAGEID=V0C&where=${queryDate}`, requestOptions)
      const result = await response.json();

      const restockTimeElement = Object.values(result)
        .map(item => item["時段選擇"])
        .filter(Boolean); // 過濾掉 undefined

      setRestockTime(restockTimeElement)

      console.log(`目前被選擇的時段：${restockTimeElement}`)

      const remained = options.filter(time => !restockTimeElement.includes(time))
      setAvailableTime(remained)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    const currentDate = value.format("YYYY/MM/DD")
    const queryDate = `1000456,eq,${currentDate}`
    fetchData(queryDate)

  }, [value]); // 每次 value 被重新選擇時

  // 指定可選日期（格式：YYYY-MM-DD）
  const allowedDates = [
    "2025-03-29",
    "2025-03-30",
    "2025-03-31",
    "2025-04-01",
  ];

  const disabledDays = (date) => {
    const dayOfWeek = date.day(); // day() 返回 0 (週日) 到 6 (週六)
    // return (dayOfWeek === 1 || dayOfWeek === 2);
    return !allowedDates.includes(date.format("YYYY-MM-DD"));
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <div className="parent-container"> */}
      <div className="container">
        <DateCalendar
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
          }}
          shouldDisableDate={disabledDays}
        />
        {/* 動態顯示可選時段 */}
        <div className="time-container">
          <div id="time-title">當日可預約時段</div>
          <div className="subTime-container">
            {restockTime.length > 0 ? (
              restockTime.map((time, index) => (
                <div key={index} className="time-box-chosen">
                  {time}
                </div>
              ))
            ) : (
              <p className="no-time"></p>
            )}
            {/* {restockTime.length > 0 ? () : (<p></p>)} */}
          </div>
          <div className="subTime-container">
            {availableTime.length > 0 ? (
              availableTime.map((time, index) => (
                <div key={index} className="time-box">
                  {time}
                </div>
              ))
            ) : (
              <p className="no-time">該日時段已額滿</p>
            )}
          </div>
        </div>
      </div>


    </LocalizationProvider>
  );
}

export default App;

