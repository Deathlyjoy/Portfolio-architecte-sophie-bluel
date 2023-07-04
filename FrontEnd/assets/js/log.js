const form = document.querySelector('#connexion');
console.log (form)
form.addEventListener("click", (e) => {
  e.preventDefault();

const email = document.querySelector("#email").value;
const password = document.querySelector("#password").value;
console.log(email)
console.log(password)

fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => {
    if (response.ok) {
        console.log("Connexion mode admin : Successful");
      return response.json();
    }
    else {
      throw new Error('Erreur dans l’identifiant ou le mot de passe');
    }
  })
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location.href="index.html"
  })
  .catch(error => {
    alert(error.message);
    console.error(error);
  });
});