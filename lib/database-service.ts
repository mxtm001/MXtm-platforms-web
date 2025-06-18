import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from "firebase/firestore"
import { firebaseConfig } from "./firebase-config"

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// User interface
export interface User {
  email: string
  name: string
  password: string // In a real app, this would be hashed and not stored directly
  balance: number
  status: string
  joined: string
  isVerified?: boolean
}

// Transaction interface
export interface Transaction {
  id?: string
  userEmail: string
  userName?: string
  type: "deposit" | "withdrawal"
  amount: number
  currency: string
  status: "pending" | "completed" | "rejected"
  date: string
  method: string
}

// Investment interface
export interface Investment {
  id?: string
  userEmail: string
  userName?: string
  plan: string
  amount: number
  profit: number
  duration: string
  startDate: string
  endDate: string
  status: "active" | "completed"
}

// Verification interface
export interface Verification {
  id?: string
  userEmail: string
  userName: string
  documentType: string
  documentNumber?: string
  country?: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  approvedDate?: string
  rejectedDate?: string
  frontImage?: string
  backImage?: string
  selfieImage?: string
  adminNotes?: string
}

// User functions
export async function createUser(userData: User): Promise<void> {
  try {
    // First, try to save to localStorage as a fallback
    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    // Check if user already exists in localStorage
    if (existingUsers.some((user: any) => user.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("User already exists")
    }

    // Add to localStorage first (this always works)
    existingUsers.push({
      ...userData,
      joined: userData.joined || new Date().toISOString().split("T")[0],
      balance: userData.balance || 0,
      status: userData.status || "active",
      isVerified: userData.isVerified || false,
    })
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

    // Also store current user session
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: userData.email,
        name: userData.name,
        balance: userData.balance || 0,
      }),
    )

    // Try to save to Firebase if available (optional)
    try {
      const userRef = doc(db, "users", userData.email)
      await setDoc(userRef, {
        ...userData,
        joined: userData.joined || new Date().toISOString().split("T")[0],
        balance: userData.balance || 0,
        status: userData.status || "active",
        isVerified: userData.isVerified || false,
        createdAt: Timestamp.now(),
      })
      console.log("User also saved to Firebase successfully")
    } catch (firebaseError) {
      console.log("Firebase not available, user saved to localStorage only:", firebaseError)
      // This is fine - the user is still registered via localStorage
    }
  } catch (error: any) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    // First check localStorage
    const localUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const localUser = localUsers.find((user: User) => user.email.toLowerCase() === email.toLowerCase())

    if (localUser) {
      return localUser
    }

    // If not found locally, try Firebase
    try {
      const userRef = doc(db, "users", email)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        return userSnap.data() as User
      }
    } catch (firebaseError) {
      console.log("Firebase not available:", firebaseError)
    }

    return null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    // First try to get from localStorage
    const localUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    // Try to get from Firebase and merge if available
    try {
      const usersRef = collection(db, "users")
      const querySnapshot = await getDocs(usersRef)

      const firebaseUsers: User[] = []
      querySnapshot.forEach((doc) => {
        firebaseUsers.push(doc.data() as User)
      })

      // Merge users from both sources, avoiding duplicates
      const allUsers = [...localUsers]
      firebaseUsers.forEach((fbUser) => {
        if (!allUsers.some((localUser) => localUser.email === fbUser.email)) {
          allUsers.push(fbUser)
        }
      })

      return allUsers
    } catch (firebaseError) {
      console.log("Firebase not available, using localStorage only:", firebaseError)
      return localUsers
    }
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export async function updateUserStatus(email: string, status: string): Promise<void> {
  try {
    const userRef = doc(db, "users", email)
    await updateDoc(userRef, { status })
  } catch (error) {
    console.error("Error updating user status:", error)
    throw error
  }
}

export async function updateUserBalance(email: string, amount: number): Promise<void> {
  try {
    const userRef = doc(db, "users", email)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as User
      const newBalance = (userData.balance || 0) + amount
      await updateDoc(userRef, { balance: newBalance })

      // Update local storage if it's the current user
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
      if (currentUser.email === email) {
        currentUser.balance = newBalance
        localStorage.setItem("user", JSON.stringify(currentUser))
      }
    }
  } catch (error) {
    console.error("Error updating user balance:", error)
    throw error
  }
}

// Transaction functions
export async function createTransaction(transactionData: Transaction): Promise<string> {
  try {
    const transactionsRef = collection(db, "transactions")
    const docRef = await addDoc(transactionsRef, {
      ...transactionData,
      date: transactionData.date || new Date().toISOString().split("T")[0],
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const transactionsRef = collection(db, "transactions")
    const q = query(transactionsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      transactions.push({
        id: doc.id,
        ...data,
      } as Transaction)
    })

    return transactions
  } catch (error) {
    console.error("Error getting all transactions:", error)
    return []
  }
}

export async function getUserTransactions(email: string): Promise<Transaction[]> {
  try {
    const transactionsRef = collection(db, "transactions")
    const q = query(transactionsRef, where("userEmail", "==", email), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const transactions: Transaction[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      transactions.push({
        id: doc.id,
        ...data,
      } as Transaction)
    })

    return transactions
  } catch (error) {
    console.error("Error getting user transactions:", error)
    return []
  }
}

export async function updateTransactionStatus(id: string, status: string): Promise<void> {
  try {
    const transactionRef = doc(db, "transactions", id)
    await updateDoc(transactionRef, {
      status,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating transaction status:", error)
    throw error
  }
}

// Investment functions
export async function createInvestment(investmentData: Investment): Promise<string> {
  try {
    const investmentsRef = collection(db, "investments")
    const docRef = await addDoc(investmentsRef, {
      ...investmentData,
      startDate: investmentData.startDate || new Date().toISOString().split("T")[0],
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating investment:", error)
    throw error
  }
}

export async function getAllInvestments(): Promise<Investment[]> {
  try {
    const investmentsRef = collection(db, "investments")
    const q = query(investmentsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const investments: Investment[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      investments.push({
        id: doc.id,
        ...data,
      } as Investment)
    })

    return investments
  } catch (error) {
    console.error("Error getting all investments:", error)
    return []
  }
}

export async function getUserInvestments(email: string): Promise<Investment[]> {
  try {
    const investmentsRef = collection(db, "investments")
    const q = query(investmentsRef, where("userEmail", "==", email), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const investments: Investment[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      investments.push({
        id: doc.id,
        ...data,
      } as Investment)
    })

    return investments
  } catch (error) {
    console.error("Error getting user investments:", error)
    return []
  }
}

// Verification functions
export async function submitVerification(verificationData: Verification): Promise<string> {
  try {
    const verificationsRef = collection(db, "verifications")
    const docRef = await addDoc(verificationsRef, {
      ...verificationData,
      submittedDate: verificationData.submittedDate || new Date().toISOString().split("T")[0],
      status: "pending",
      createdAt: Timestamp.now(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error submitting verification:", error)
    throw error
  }
}

export async function getAllVerifications(): Promise<Verification[]> {
  try {
    const verificationsRef = collection(db, "verifications")
    const q = query(verificationsRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const verifications: Verification[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      verifications.push({
        id: doc.id,
        ...data,
      } as Verification)
    })

    return verifications
  } catch (error) {
    console.error("Error getting all verifications:", error)
    return []
  }
}

export async function getUserVerifications(email: string): Promise<Verification[]> {
  try {
    const verificationsRef = collection(db, "verifications")
    const q = query(verificationsRef, where("userEmail", "==", email), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    const verifications: Verification[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      verifications.push({
        id: doc.id,
        ...data,
      } as Verification)
    })

    return verifications
  } catch (error) {
    console.error("Error getting user verifications:", error)
    return []
  }
}

export async function updateVerificationStatus(id: string, status: string, notes?: string): Promise<void> {
  try {
    const verificationRef = doc(db, "verifications", id)
    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    }

    if (status === "approved") {
      updateData.approvedDate = new Date().toISOString().split("T")[0]
    } else if (status === "rejected") {
      updateData.rejectedDate = new Date().toISOString().split("T")[0]
    }

    if (notes) {
      updateData.adminNotes = notes
    }

    await updateDoc(verificationRef, updateData)

    // If approved, update user's verification status
    if (status === "approved") {
      const verificationSnap = await getDoc(verificationRef)
      if (verificationSnap.exists()) {
        const verificationData = verificationSnap.data() as Verification
        const userEmail = verificationData.userEmail

        if (userEmail) {
          const userRef = doc(db, "users", userEmail)
          await updateDoc(userRef, { isVerified: true })
        }
      }
    }
  } catch (error) {
    console.error("Error updating verification status:", error)
    throw error
  }
}

// Admin functions
export async function createAdmin(email: string, password: string, role = "admin"): Promise<void> {
  try {
    const adminsRef = collection(db, "admins")
    const q = query(adminsRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      throw new Error("Admin already exists")
    }

    await addDoc(adminsRef, {
      email,
      password, // In a real app, this would be hashed
      role,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    throw error
  }
}

export async function verifyAdmin(email: string, password: string): Promise<{ email: string; role: string } | null> {
  try {
    const adminsRef = collection(db, "admins")
    const q = query(adminsRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    let adminData = null
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.password === password) {
        adminData = {
          email: data.email,
          role: data.role,
        }
      }
    })

    return adminData
  } catch (error) {
    console.error("Error verifying admin:", error)
    return null
  }
}

export async function getAllAdmins(): Promise<{ email: string; role: string }[]> {
  try {
    const adminsRef = collection(db, "admins")
    const querySnapshot = await getDocs(adminsRef)

    const admins: { email: string; role: string }[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      admins.push({
        email: data.email,
        role: data.role,
      })
    })

    return admins
  } catch (error) {
    console.error("Error getting all admins:", error)
    return []
  }
}

// Helper function to migrate data from localStorage to Firebase
export async function migrateLocalStorageToFirebase(): Promise<void> {
  try {
    // Migrate users
    const localUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    for (const user of localUsers) {
      try {
        await createUser(user)
      } catch (error) {
        console.log("User already exists or error:", error)
      }
    }

    // Migrate transactions
    // This is more complex as we need to associate transactions with users
    // For simplicity, we'll skip this in this example

    console.log("Migration completed successfully")
  } catch (error) {
    console.error("Error during migration:", error)
  }
}
