const baseUrl = 'http://localhost:8383'

var contact;
var msg;

export async function sendSms(location) {
    console.log(location)
    // e.preventDefault()
    fetch(`${baseUrl}?location=${location}`, {method: 'GET', mode: 'cors'})
    .then(function(response) {
        //console.log(response.json())
        return response.json();
    }).then(data => {
        console.log(data)
    }).catch(function(err){
        console.log(err)
    })
}