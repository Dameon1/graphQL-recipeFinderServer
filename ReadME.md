# what2eat

## Server side code using GraphQL for what2eat.website

## Application details

- A Recipe finder that allows you to see recipes based on the ingredints you have and lets you see
  how many you are missing for the particular recipe.
- Navigating to the ** (Where to find page) will reveal a layout of a welcome page where you can make an          account to get full features or continue on to the recipe finder itself for quick access.
- On selecting a recipe you will get a soft view of the instructions and how to make the desired
  recipe with instructional overview.
- There is a link at the bottom of the page leading to an in-depth overview of the recipe which will
  lead the user to a new page where a more in-depth view of the recipe is kept.
- Created account users can keep track of saved recipes for quick access to get back to them , along with         removing them if they are no longer wanted.

## Where to find

You can visit  [what2eat here](https://www.dameonmendoza.com/graphQL-recipeFinderClient/) !

## Instructions

- The Sign up button at the top of the home page will lead you to a create an account form to enter your          details.
- After signing up, you can pick from some predetermined ingredients in the check boxes provided,
  Or you can create your own, making the application more versatile for production.
- Upon searching, the screen will be populated with recipes that closely match your desired inputs, with         recipe overviews that includes images of the desired outcome, also information including how many of your 
  ingredients are used in the recipe and how many ingredients you are missing, with an option to go to the recipe overview.
- At the recipe overview page , you will be greeted you with a larger view of the recipe outcome picture
  along with a list of instructions and a save button if you want to keep it around for quick access.
- Once you have saved a few recipes there is a separate page that keeps track of all the recipes you have
  saved in the MyRecipes link provide at the top of the page.
- On the MyRecipes page you find a similar display to the search. Displaying all the recipes you have kept.

## Coding styles

TODO--Technologies and why

## Screenshots

- Mobile screenshots on the left and right
- On the left you will find what single recipe search will provide you
- On the right is the "search for" screen, where you can add and pick from options
- The middle picture is an overview of what the search result will look like on a full sized screen

<img align="left" width="200" height="300" src="/assets/images/singleRecipe.png">
<img align="right" width="200" height="300" src="/assets/images/homescreen.png">
<p align="center">
  <img width="600" height="520" src="/assets/images/searchedRecipes.png">
</p>

## Contributions

Contributions to the application are accepted. If you have a design suggestion, feel free to
change and make a pull request. I styled this app with the simplest of styles.

## Built With
- [GraphQL](https://graphql.org/) - Server API
- [Apollo](https://www.apollographql.com/) - State management.
- [GraphQl-Yoga](https://github.com/prisma/graphql-yoga/blob/master/README.md) - GraphQL Server.
- [Enzyme](https://airbnb.io/enzyme) - Testing framework
- [JWT-decode](https://www.npmjs.com/package/jwt-decode) - Verification
- [Mongo](https://www.mongodb.com) - The database used to store information
- [Mongoose](http://mongoosejs.com/docs/guide.html) - Framework used to access DB
- [Node.js](https://nodejs.org/en) - Runtime enviorment for package management
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs) - For security of user accounts

## Authors

- **Dameon Mendoza** - *Initial work* - [dameon1](https://github.com/dameon1)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

[Spoonacular](https://spoonacular.com/)
