window.addEventListener('load', () => {

    const phone = localStorage.getItem('Phone Number')
    const firstname = localStorage.getItem('First Name')
    const lastname = localStorage.getItem('Last Name')

    document.getElementById('phonenr-result').innerHTML = phone;
    document.getElementById('fname-result').innerHTML = firstname;
    document.getElementById('lname-result').innerHTML = lastname;
})