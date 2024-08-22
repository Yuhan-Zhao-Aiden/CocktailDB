import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";
import _ from "lodash";

const app = express();
const port = process.env.PORT || 3000;
var drink = undefined;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("combined"));

app.get("/", async (req, res) => {
	try {
		if (!drink) {
			drink = await axios.get(
				"https://www.thecocktaildb.com/api/json/v1/1/random.php"
			);
		}
	} catch (error) {
		console.log(error);
	}

	//console.log(drink.data.drinks[0].strDrinkThumb);
	const randDrink = drink.data.drinks[0];
	var ingredients = [];
	var ingredientsList = [];
	var run = 1;
	while (randDrink["strIngredient" + run]) {
		ingredients.push(
			randDrink["strMeasure" + run] +
				" " +
				randDrink["strIngredient" + run]
		);
		ingredientsList.push(randDrink["strIngredient" + run]);
		run += 1;
	}
	res.render("index.ejs", {
		content: randDrink,
		ingredients: ingredients,
		ingredientsList: ingredientsList,
	});
});

app.get(["/Alcoholic", "/Non_Alcoholic"], async (req, res) => {
	var drinkList;
	var endpoint;
	try {
		endpoint = req.originalUrl.substring(1);
		drinkList = await axios.get(
			`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${endpoint}`
		);
	} catch (error) {
		console.log(error);
	}

	res.render("list.ejs", {
		title: _.replace(_.capitalize(endpoint), "_", " "),
		content: _.sampleSize(drinkList.data.drinks, 16),
	});
});

app.get("/drink/:id", async (req, res) => {
	const drinkId = req.params["id"];
	try {
		drink = await axios.get(
			`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`
		);
		res.redirect("/");
	} catch (error) {
		console.log(error.message);
	}
});

app.post("/search", async (req, res) => {
	const sInput = req.body.sInput;
	try {
		// throw new Error("Error");
		drink = await axios.get(
			`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${sInput}`
		);
		res.redirect("/");
	} catch (error) {
		res.render("error.ejs");
	}
});

app.get("/random", (req, res) => {
	drink = undefined;
	res.redirect("/");
});

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});
