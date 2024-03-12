import { defineStore } from "pinia";
import { auth, db } from "@/firebase/init";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAdmin = ref(false);
  const error = ref("");

  async function checkUserRole(firebaseUser) {
    if (!firebaseUser) {
      isAdmin.value = false;
      return;
    }
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    isAdmin.value = userDoc.exists() && userDoc.data().role === "admin";
    if (!isAdmin.value) {
      error.value = "Access Denied. You are not an admin.";
    } else {
      error.value = ""; // Reset error message if admin
    }
  }

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser;
    checkUserRole(firebaseUser);
  });

  const signOut = async () => {
    await firebaseSignOut(auth);
    user.value = null;
    isAdmin.value = false;
  };

  return { user, isAdmin, error, signOut, checkUserRole };
});
