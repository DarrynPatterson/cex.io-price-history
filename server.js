const express = require("express");
const app = express();

// Routes
app.use("/", require("./routes/index"));

//// create a GET route
//app.get("/express_backend", (req, res) => {
//  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
//});

const PORT = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
