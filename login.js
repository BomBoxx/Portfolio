document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://portfolio-admin-panel-1.onrender.com/auth/login", {
    method: "POST",
    headers: {
      "x-api-key": "mysecretapikey123"
    },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    alert("Invalid credentials");
    return;
  }

  const data = await res.json();
  localStorage.setItem("access_token", data.access_token);

  window.location.href = "dashboard.html";
});
