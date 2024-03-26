import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth, db } from "@/firebase/init";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const user = ref<User | null>(null);
const error = ref<string | null>(null);
const isAdmin = ref<boolean>(false);

function redirectToAdmin(router) {
  const basePath = import.meta.env.VITE_APP_BASE_URL.endsWith("/")
    ? import.meta.env.VITE_APP_BASE_URL.slice(0, -1)
    : import.meta.env.VITE_APP_BASE_URL;
  const adminPath = `${basePath}/admin`;
  router.push(adminPath);
}

async function checkUserRole(currentUser: User, router) {
  const userDocRef = doc(db, "users", currentUser.uid);
  const userDoc = await getDoc(userDocRef);
  isAdmin.value = userDoc.exists() && userDoc.data().role === "admin";
  if (!isAdmin.value) {
    error.value = "Access Denied. You are not an admin.";
  } else {
    redirectToAdmin(router);
  }
}

export const useAuth = () => {
  const router = useRouter();

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await checkUserRole(result.user, router);
    } catch (err) {
      error.value = err.message;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    user.value = null;
    isAdmin.value = false;
    router.push("/");
  };

  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      await checkUserRole(currentUser, router);
    } else {
      user.value = null;
      isAdmin.value = false;
    }
  });

  onMounted(async () => {
    await getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          checkUserRole(result.user, router);
        }
      })
      .catch((err) => {
        error.value = err.message;
      });
  });

  return {
    user,
    error,
    isAdmin,
    signInWithGoogle,
    signInWithEmail,
    signOut,
  };
};
