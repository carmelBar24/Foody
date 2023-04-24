
/*Init Meal&Ui*/
const meal=new Meal();
const ui=new Ui();


/*Input Fetching*/
const searchRecipe=document.querySelector("#searchRecipe");
/*Events*/
searchRecipe.addEventListener('keyup',(e)=>{
    // Get input text
    const userText = e.target.value;
    if(userText !== ''){
        // Make http call
        console.log(e.target.parent)
        meal.getFood(userText)
            .then(data => {
                if(data.food.meals === null) {
                    // Show alert
                    ui.showAlert('Recipe not found', 'alert alert-danger');
                    ui.clearFood();
                }
                else {
                    ui.showFood(data.food.meals[0]);
                    ui.showIngredient(data.ingredient.meals[0]);
                }
            })
    }
    else {
        // Clear profile
        ui.clearFood();
    }
});
