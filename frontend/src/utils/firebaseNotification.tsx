import Toast from "../components/Toast";
import { messaging,getToken } from "../firebase";
import { UpdateUserName } from "../redux/actions/userActions";
export const requestPermission = async () => {
    const env = process.env

    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: env.REACT_APP_FIREBASE_VAPIDID // get this from Firebase console
            });

            UpdateUserName({deviceToken:token})
           
        } else {
            Toast.error("Permission not granted for notifications.","Permission denied");
        }
    } catch (err) {
        console.error("An error occurred while retrieving token. ", err);
    }
};



