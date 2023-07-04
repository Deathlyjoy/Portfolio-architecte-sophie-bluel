// API
async function dataWorks() { 
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok === true) {
        console.log("Connexion dataWork : Successful");
        return response.json();
      } else {
        console.log("Error Connexion API : " + response.error);
      }
}
console.log(dataWorks());

async function dataCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  if (response.ok === true) {
      console.log("Connexion dataCategories : Successful");
      return response.json();
    } else {
      console.log("Error Connexion API : " + response.error);
    }
}
console.log(dataCategories());