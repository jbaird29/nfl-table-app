import app from 'firebase/app'
import 'firebase/functions'
import 'firebase/firestore'
import config from './firebaseconfig'

class Firebase {
    constructor() {
        app.initializeApp(config);
    }
}
   
export default Firebase;
  