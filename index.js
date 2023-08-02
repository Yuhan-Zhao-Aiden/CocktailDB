import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";

const app = express();
const port = 3000;
var drink = undefined;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        if (!drink) {
            drink = await axios.get(
                "https://www.thecocktaildb.com/api/json/v1/1/random.php"
            );
        }
        
        //console.log(drink.data.drinks[0].strDrinkThumb);
        const randDrink = drink.data.drinks[0];
        var ingredients = [];
        var ingredientsList = []
        var run = 1;
        while (randDrink["strIngredient" + run]) {
            
            ingredients.push(randDrink["strMeasure" + run] + " " + randDrink["strIngredient" + run]);
            ingredientsList.push(randDrink["strIngredient" + run]);
            run += 1;
        }
        res.render("index.ejs", { 
            content: randDrink,
            ingredients: ingredients,
            ingredientsList: ingredientsList
        });
    } catch(error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})