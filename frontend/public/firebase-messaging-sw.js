/** @format */
/* eslint-env serviceworker */
/* global firebase */
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCvuXHwcOzLTRlTJtWAiOqUzWTQPFl3-yg",
  authDomain: "bisats-77f41.firebaseapp.com",
  projectId: "bisats-77f41",
  storageBucket: "bisats-77f41.firebasestorage.app",
  messagingSenderId: "153517917101",
  appId: "1:153517917101:web:7b8224793d1ff0dffe1724",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
