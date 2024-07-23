import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

const Timestamp = ({ timestamp }) => {
  const now = new Date();
  const messageDate = new Date(timestamp);

  let formattedDate;
  if (isToday(messageDate)) {
    formattedDate = `Today at ${format(messageDate, 'HH:mm')}`;
  } else if (isYesterday(messageDate)) {
    formattedDate = `Yesterday at ${format(messageDate, 'HH:mm')}`;
  } else {
    formattedDate = format(messageDate, 'dd:MM:yyyy') + ' at ' + format(messageDate, 'HH:mm');
  }

  return <span className='timestamp'>{formattedDate}</span>;
};

export default Timestamp;
