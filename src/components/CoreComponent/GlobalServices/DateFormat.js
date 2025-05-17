import { format } from 'date-fns';
import { Constants } from './Constants';

export const DateFormat = {
    getCurrentDateTime,
    getServerDateFormat,
    getCurrentDate,
    getCurrentTime,
    getTodayShortDay
};

function getCurrentDateTime() {
    return format(new Date(), Constants.DateTimeFormat);
}

function getServerDateFormat(){
    return format(new Date(),Constants.ServerDateFormat)
}


function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  function getTodayShortDay() {
    const daysMap = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)
    return daysMap[today];
  }

// Globalservices
// Date
// getimagepath

