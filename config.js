const mongoose = require("mongoose");

// const url = process.env.BACKEND_MONGODB_URL;
// const DB_OPTIONS = {
//   dbName: process.env.DBNAME,
//   user: process.env.DBUSERNAME,
//   pass: process.env.DBPASSWORD,
//   authSource: process.env.DBAUTHSOURCE
// }

// mongoose.connect("mongodb://127.0.0.1:27017",DB_OPTIONS)

// mongoose
// .connect("mongodb://localhost:27017/ntpl_dod")

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("database connection established");
    })
    .catch((err) => {
        console.log(err.Message);
    });