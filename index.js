let express    = require("express");
let app        = express();
let bodyParser = require("body-parser");
const server   = require('http').Server(app);
const io       = require('socket.io')(server);
const TuyAPI   = require('tuyapi');
const PORT     = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Running on port: " + PORT)
});

let devices = [
  { id: '3330213668c63ac88dae', key: 'ae94d46dce282980' },
  { id: '3330213684f3eb5b8f92', key: 'b9407df05d1fb3ea' }
].map((device) => {
  return new TuyAPI(device);
});

app.set("views", "./views");
app.set("view engine", "pug");

app.use('/static', express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.render("index");
});

io.on('connection', (socket) => {
  for(let i = 0; i < devices.length; i++){
    let device = devices[i];

    device.find().then(() => {
      device.connect();
    });

    device.on('connected', () => {
      io.emit("console", 'Connected to device!');
    });

    device.on('disconnected', () => {
      io.emit("console", 'Disconnected from device!');
    });

    device.on('error', error => {
     io.emit("console", "Error: " + error);
    });
  }
 
  socket.on("changeColor", (data) => {
    for(let i = 0; i < devices.length; i++){
      devices[i].set({ dps: 1, set: true });
      devices[i].set({ dps: 2, set: "colour" });
      devices[i].set({ dps: 5, set: data });
    }
  });
});