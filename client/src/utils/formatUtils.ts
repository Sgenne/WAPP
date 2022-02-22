/**
 * Returns a formatted date string.
 *
 * @param date - Date object containing the time of the returned date string.
 */
export const formatDate = (date: Date) => {
  const dayOfTheMonth = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${dayOfTheMonth}/${month}-${year} ${hours}:${minutes}`;
};
