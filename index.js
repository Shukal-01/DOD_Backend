// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");



const app = express();

//-----------------------------------------mongoose connection end
const connectDB = require("./config.js");

//-----------------------------------------mongoose connection end

const loginRoutes = require("./routes/auth/routes");
const webRoutes = require("./routes/api/web");
const adminRoutes = require("./routes/admin/routes");
const patientRoutes = require("./routes/api/patient");
const doctorRoutes = require("./routes/api/doctor");
const serviceProviderRoutes = require("./routes/api/serviceProvider");
const formRoutes = require("./routes/api/form");
const adminMiddleware = require("./middleware/admin.middleware");
const patientMiddleware = require("./middleware/patient.middleware");
const doctorMiddleware = require("./middleware/doctor.middleware");
const serviceProviderMiddleware = require("./middleware/serviceProvider.middleware");
const globalSocketServer = require("./globalSocketIoServer.js");
const socketIoServer = require("./socketIoServer.js");

// ----------------- backup dirs --------------------------------
const backupRoute = require('./controller/backup/backupHandler')
// ----------------- backup dirs --------------------------------

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
// router middleware
app.use(cors());
app.set('trust proxy', 1);

app.use(fileupload());

app.use(express.static(path.join(__dirname, "assets")));
app.use("/auth", loginRoutes);
app.use("/auth/*", loginRoutes);
app.use("/web", webRoutes);
app.use("/web/*", webRoutes);
app.use("/admin", adminMiddleware.authenticateToken, adminRoutes);
app.use("/admin/*", adminMiddleware.authenticateToken, adminRoutes);
app.use("/patient", patientMiddleware.authenticateToken, patientRoutes);
app.use("/patient/*", patientMiddleware.authenticateToken, patientRoutes);
app.use("/doctor", doctorMiddleware.authenticateToken, doctorRoutes);
app.use("/doctor/*", doctorMiddleware.authenticateToken, doctorRoutes);
app.use(
  "/serviceProvider",
  serviceProviderMiddleware.authenticateToken,
  serviceProviderRoutes
);
app.use(
  "/serviceProvider/*",
  serviceProviderMiddleware.authenticateToken,
  serviceProviderRoutes
);

app.use("/form", formRoutes);
app.use("/form/*", formRoutes);

// -------------------------------------
app.use("/backup", backupRoute)

// -------------------------------------

app.use("/", (req, res) => {
  return res.status(404).json({ message: "error", detail: "page not found" });
});

// // -------------- start global socket server ------------------
// globalSocketServer();

// // -------------- start socker Io server ------------------
// socketIoServer();

// app.listen(port, () => {
//   console.log(`you server is started at http://localhost:${port}`);
// });

// // Socket servers
// globalSocketServer();
// socketIoServer();

// (async () => {
  connectDB(); // 🔑 Ensure DB is connected

  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });

  // Start sockets or other async features here
  globalSocketServer();
  socketIoServer();
// })();