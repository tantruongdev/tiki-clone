export const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';  // Return an empty string if dateStr is undefined

  const date = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  };

  const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);
  return formattedDate;
}
