import Toast from "../components/Toast";
import { messaging,getToken } from "../firebase";
export const requestPermission = async () => {
    const env = process.env

    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: env.REACT_APP_FIREBASE_VAPIDID // get this from Firebase console
            });

            console.log("FCM Token:", token);
            // Send this token to your backend dev to send messages to this client
        } else {
            Toast.error("Permission not granted for notifications.","Permission denied");
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
    }
};



