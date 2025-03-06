// services/authService.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { checkUserDoc, createUserDoc } from './api';
import { auth } from './firebaseConfig';


// moved logic out of login_screen to here
export async function signInAndEnsureUserDoc(email, password) {
  try {
    console.log("signInAndEnsureUserDoc email:", email);
    console.log("signInAndEnsureUserDoc password:", password);

    // sign in with Firebase Auth
    console.log("auth:", typeof(auth));

    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const uid = userCred.user.uid || "";
    const userEmail = userCred.user.email || "";

    // check if user doc in Firestore (w/ backend)
    const checkRes = await checkUserDoc(uid);

    if (checkRes.found) {
      console.log("\n\nUser doc found:\n", checkRes.docId);
      return { success: true, existing: true, docId: checkRes.docId };
    } else {
      // create if not
      const createRes = await createUserDoc(uid, userEmail);
      if (createRes.ok) {
        // return docId if sucessful
        console.log("\n\ncreated user doc:\n\n", checkRes.docId);
        return {
          success: true,
          existing: false,
          docId: createRes.docId
        };
      } else {
        return {
          success: false,
          error: createRes.error,
        };
      }
    }
  } catch (err) {
    console.error("signInAndEnsureUserDoc error:", err);
    return { success: false, error: err.message };
  }
}