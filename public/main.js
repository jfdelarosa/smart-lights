var socket = io.connect('http://localhost:3000');

let r = "00",
    g = "FF",
    b = "00",
    h = "FF",
    s = "FF",
    v = "FF";

let addListenerMulti = (el, s, fn) => {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

let numberToHex = (number) => {
  if(number == 0){
    return "00";
  }
  return Number(number).toString(16).toUpperCase();
}

let color = (hex) => {
  let ret = hex + "00" + h + s + v;
  console.log(ret);
  socket.emit("changeColor", ret);
}

socket.on('console', (data) => {
  console.log(data);
});
addListenerMulti(document.getElementById("color"), "input change", (e) => {
  color(e.target.value.substring(1).toUpperCase());
});