// API
async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    if (response.ok === true) {
        console.log("Connexion API : Successful");
        return response.json();
      } else {
        console.log("Error Connexion API : " + response.error);
      }
    // const data = await response.json();
    // console.log(data);
    // return data;
}
console.log(fetchWorks());