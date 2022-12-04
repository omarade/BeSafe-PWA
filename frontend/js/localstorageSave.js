function handleSubmit(){

    const phone = document.getElementById('phonenr').value;
    const firstname = document.getElementById('fname').value;
    const lastname = document.getElementById('lname').value;


    localStorage.setItem("First Name", firstname);
    localStorage.setItem("Last Name", lastname)
    localStorage.setItem("Phone Number", phone);
    
    return;

}