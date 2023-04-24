class Meal {
    constructor() {
      //variabels for fetch
    }


    async getFood(meal) {

        const profileResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
        const ingredientResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}&i=list`);
        const food = await profileResponse.json();
        const ingredient = await ingredientResponse.json();
        return {
            food,
            ingredient
        }
    }
}