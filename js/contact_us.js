var submitButton = document.getElementById("contact__form");

var form_components = document.getElementsByClassName("form_component");

submitButton.addEventListener("submit", CheckPopulatedFields);


//Checks if all fields are populated, otherwise doesn't submit
function CheckPopulatedFields(event)
{
    event.preventDefault();
    for(var i = 0; i < form_components.length; ++i)
    {
        if(form_components[i].value.trim().length == 0)
        {
            console.log("Empty field");
            return false;
        }
    }
    console.log("all fields populated");
    return false; //change this to true when we want to utilize the form.
}