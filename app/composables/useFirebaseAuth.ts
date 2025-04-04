import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  type Auth, 
  type User 
} from 'firebase/auth'
import { doc, setDoc, getDoc, type Firestore } from 'firebase/firestore'

export default function() {
  const nuxtApp = useNuxtApp();
  const auth = nuxtApp.$auth as Auth;
  const db = nuxtApp.$db as Firestore;
  const router = useRouter()

  if (!auth) {
    throw new Error("Firebase Auth is not initialized");
  }

  const user = useState<User | null>("fb_user", () => null)
  const userRole = useState<string | null>("fb_user_role", () => null)
  const loading = useState<boolean>('auth_loading', () => true)

  // Fetch role from Firestore
  const fetchUserRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        userRole.value = userDoc.data().role
      }
    } catch (error) {
      console.error("Error fetching role:", error)
    }
  }

  // Admin creates lecturers & students
  const createUser = async (email: string, password: string, role: string) => {
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password)
      if (userCreds) {
        await setDoc(doc(db, "users", userCreds.user.uid), { email, role })
        return true
      }
    } catch (error) {
      console.error("User creation error:", error)
      return false
    }
  }

  // Login & fetch role
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCreds = await signInWithEmailAndPassword(auth, email, password)
      if (userCreds) {
        user.value = userCreds.user
        await fetchUserRole(userCreds.user.uid)
        return true
      }
      return false
    } catch (error) {
      console.error("Login Error:", error)
      return false
    }
  }

  // Logout
  const logoutUser = async () => {
    console.log("logout user");
    
    await signOut(auth)
    user.value = null
    userRole.value = null
    
    router.push('/selectUser');
    
  }

  // Persist authentication state
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      user.value = firebaseUser
      await fetchUserRole(firebaseUser.uid)
    } else {
      user.value = null
      userRole.value = null
    }
    loading.value = false
  })

  return {
    user,
    userRole,
    loading,
    createUser,
    loginUser,
    logoutUser
  }
}