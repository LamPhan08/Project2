import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBeA0Jf982IMlRIu1W6lBXCQCy9rpkykls",
  authDomain: "reportmanagementweb-409108.firebaseapp.com",
  projectId: "reportmanagementweb-409108",
  storageBucket: "reportmanagementweb-409108.appspot.com",
  messagingSenderId: "428150027554",
  appId: "1:428150027554:web:f1d7bf4e26dfe694fc617b",
  measurementId: "G-PH5CN69YDZ"
}

export const app = firebase.initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)


const firestore = app.firestore()
export const database = {
  users: firestore.collection("users"),
  folders: firestore.collection("folders"),
  files: firestore.collection("files"),
  removedFolders: firestore.collection('removedFolders'),
  removedFiles: firestore.collection('removedFiles'),
  sharedFiles: firestore.collection('sharedFiles'),
  formatDoc: doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp
}

export const auth = app.auth()
export const storage = app.storage()

