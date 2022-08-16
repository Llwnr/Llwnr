function toggleCheckbox(){
    console.log("ok");
    var formItem = document.getElementById("login-form");
    formItem.querySelector('input[type="checkbox"]').checked = !formItem.querySelector('input[type="checkbox"]').checked;
}