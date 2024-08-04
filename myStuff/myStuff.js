
export const myTimeStr = () => {
  return new Date().toLocaleTimeString();
}

export const myLog = (msg) => {
  console.log ('>>> ' + myTimeStr () + ' ' + msg);
}
