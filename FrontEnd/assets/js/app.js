// API
async function works() {
    const response = await fetch("http://localhost:5678/api/works");
    const dataWorks = await response.json();
    console.log(dataWorks);
    return dataWorks;
}