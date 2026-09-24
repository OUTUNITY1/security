// Firebase configuration for SecureX (compat SDK for easy multi-page use)
const firebaseConfig = {
  apiKey: "AIzaSyBwDIpIU6ajWR6AxFtNyPvA14P6mNB9lLw",
  authDomain: "findhome777.firebaseapp.com",
  databaseURL: "https://findhome777-default-rtdb.firebaseio.com",
  projectId: "findhome777",
  storageBucket: "findhome777.firebasestorage.app",
  messagingSenderId: "290873525366",
  appId: "1:290873525366:web:58eac1c410d517015c0b57"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

// Only this email can access Admin panel
const ADMIN_EMAIL = "lga775385@gmail.com";

// Helper: check if current user is admin
function isAdminUser(user) {
  return user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Protect admin pages - call on every admin page load
function requireAdminAuth() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user && isAdminUser(user)) {
        resolve(user);
      } else {
        // Not logged in or not admin → redirect to login
        if (user && !isAdminUser(user)) {
          // Logged in as client, force logout from admin
          auth.signOut().then(() => {
            window.location.href = "../login.html?error=admin_only";
          });
        } else {
          window.location.href = "../login.html";
        }
        reject(new Error("Unauthorized"));
      }
    });
  });
}

// Logout helper
function doLogout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    auth.signOut().then(() => {
      localStorage.removeItem("securex_auth");
      localStorage.removeItem("securex_user");
      window.location.href = window.location.pathname.includes("/admin/") ? "../login.html" : "login.html";
    });
  }
}
