var admin = require("firebase-admin");

var serviceAccount = require("./dod-doctor-on-door-firebase-adminsdk-fbsvc-75e77e5ed1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendFirebaseNotification = async (deviceToken, title, body) => {
    const message = {
      token: deviceToken, // 🔴 User's device token
      notification: {
        title: title,
        body: body,
      },
      android: {
        priority: "high",
        notification: {
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log("✅ Notification sent successfully:", response);
    } catch (error) {
      console.error("❌ Error sending notification:", error);
    }
  };

module.exports = sendFirebaseNotification;
  