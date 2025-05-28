export function formatDateToddMMyyyy(date: Date, separator: string = "/") {
  const day = date.getDate().toString().padStart(2, "0");
  // JavaScript just had to mess it up at 1-indexed months
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().padStart(4, "0");
  return day + separator + month + separator + year;
}

export function formatDateToHHmm(date: Date, separator: string = ":") {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return hours + separator + minutes;
}

export function splitTimeFromSeconds(seconds: number) {
  let temp = seconds;
  const hours = Math.floor(temp / 3600);
  temp %= 3600;
  const minutes = Math.floor(temp / 60);
  temp %= 60;

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: temp.toString().padStart(2, "0"),
  };
}
