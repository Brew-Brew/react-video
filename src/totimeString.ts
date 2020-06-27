const toTimeString = (second: number) => {
  const date = new Date(second * 1000);

  const mm = date.getUTCMinutes();
  const ss = date.getSeconds();

  const formattedMinute = mm + ":";
  const formattedSecond = (ss < 10 ? "0" : "") + ss;

  return formattedMinute + formattedSecond;
};

export default toTimeString;
