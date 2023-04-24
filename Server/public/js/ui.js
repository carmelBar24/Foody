class Ui {
    constructor() {
        this.food=document.querySelector("#food");
        this.content=document.querySelector("#Food-content");
    }

    showAlert(msg, className) {
        this.clearAlert();
        const alert=document.createElement('div');
        alert.className=className;
        alert.appendChild(document.createTextNode(msg));
        const container=document.querySelector(".search");
        const search=document.querySelector("#Food-content");
        container.insertBefore(alert,search);
        setTimeout(()=>{this.clearAlert()},3000);
    }

    showFood(meal) {

        this.food.innerHTML=`
        <div class="card card-body mb-3">
            <article class="recipe">
                <h2> Name: ${meal.strMeal}</h2>
                <div class="col-md-3">
                <img  class="img-fluid mb-2" src="${meal.strMealThumb}">
                <h3>Categoy: ${meal.strCategory}</h3>
                </article>
            </div>
      </div>`
        this.content.innerHTML=`<div class="card card-body mb-3">
        <article class="recipe">
        <span>Area: </span>${meal.strArea}
        <br>
        <span>Instructions:</span>
        <p>${meal.strInstructions}
        </p>
        <ul id="food-ul">
        Ingredient:
        </ul>
        </article> 
        </div>`

    }



    clearFood() {
        this.food.innerHTML="";
        this.content.innerHTML="";
    }

    clearAlert() {
        const currentAlert=document.querySelector(".alert");
        if(currentAlert)
        {
            currentAlert.remove()
        }
    }

    showIngredient(ingredient) {
        const ul=document.querySelector("#food-ul");
        let i=1;
        while(ingredient["strIngredient" + i]!=""){
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`ingredient ${i} : ${ingredient["strIngredient" + i]}`));
            ul.appendChild(li);
            i=i+1;
        }

    }
}