function getToken() {
  return localStorage.getItem("access_token");
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "login.html";
}

document.getElementById("logoutBtn")?.addEventListener("click", logout);
