/**
 * Returns a formatted date string.
 *
 * @param date - Date object containing the time of the returned date string.
 */
export const formatDate = (date: Date) => {
  const dayOfTheMonth = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  if (minutes.length === 1) minutes = "0" + minutes;
  if (hours.length === 1) hours = "0" + hours;

  return `${dayOfTheMonth}/${month}-${year} ${hours}:${minutes}`;
};
