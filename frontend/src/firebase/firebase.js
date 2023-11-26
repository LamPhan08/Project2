import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALnSkh0DeNOUc2CleIdAb9oF_vTQwQE_w",
    authDomain: "report-management-website.firebaseapp.com",
    projectId: "report-management-website",
    storageBucket: "report-management-website.appspot.com",
    messagingSenderId: "258715274517",
    appId: "1:258715274517:web:9ee033defdba7f7f88ad1c",
    measurementId: "G-LVMQRF2SX1"
  };

  const app = firebase.initializeApp(firebaseConfig)
  // const analytics = getAnalytics(app)

  const firestore = app.firestore()
  export const database = {
    folders: firestore.collection("folders"),
    files: firestore.collection("files"),
    formatDoc: doc => {
      return {
        id: doc.id ,
        ...doc.data()
      }
    },
    getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
  }

  export const auth = app.auth()

  