

//porting the action creators from client side
//To do
// API BASE URL  in .env file
// Create Resolvers for requests
//


export const fetchRecipeIdsFromDatabase = (userId,authToken) => (dispatch) => {
  dispatch(fetchRecipesFromDatabaseRequest());
  return fetch(`${API_BASE_URL}/api/recipes/?userId=${userId}`,{
    headers: { 'Authorization': `Bearer ${authToken}` }})
  .then(res => {            
    if (!res.ok) { return dispatch(fetchRecipesFromDatabaseError(res.statusText))}
    return res.json() })
  .then(recipes => dispatch(fetchRecipesFromDatabaseSuccess(recipes)))
  .catch(error => dispatch(fetchRecipesFromDatabaseError(error)));
}

export const postRecipeToDatabase = (recipeId,userId,authToken) => (dispatch) => {
  dispatch(postRecipeToDatabaseRequest());
  return fetch(`${API_BASE_URL}/api/recipes`, {
      body: JSON.stringify({recipeId:recipeId,}), 
      cache: 'no-cache', 
      headers: { 'Authorization': `Bearer ${authToken}`,
                 'content-type': 'application/json' },
      method: 'POST',
      mode: 'cors', 
      redirect: 'follow', 
      referrer: 'no-referrer',})
  .then(res => {
      if (!res.ok) { return Promise.reject(res.statusText)}
      return res.json();
      })
  .then(response => dispatch(postRecipeToDatabaseSuccess()))
  .catch(error => dispatch(postRecipeToDataBaseError(error)));
};

export const removeRecipeFromDatabase = (id,userId,authToken) => (dispatch) => {
  dispatch(removeRecipeFromDatabaseRequest());
  return fetch(`${API_BASE_URL}/api/recipes/${id}`, {
      cache: 'no-cache', 
      headers: { 'Authorization': `Bearer ${authToken}`,
                 'content-type': 'application/json' },
      method: 'DELETE',
      mode: 'cors', 
      redirect: 'follow',
      referrer: 'no-referrer', 
    })
  .then(() => dispatch(fetchRecipeIdsFromDatabase(userId,authToken)) )
  .catch(error => dispatch(fetchRecipesFromDatabaseError(error)));
};

export const getUserRecipesInBulkFromSpoonacular = (recipes) => (dispatch) => {

  let recipeBulkString="";
  for (let i =0;i<recipes.length;i++){
    recipeBulkString += recipes[i].recipeId+",";
  }

  let recipeString = recipeBulkString.slice(0,-1);
  dispatch(fetchRecipesFromSpoonacularInBulk(recipeString))
};

export const fetchRecipesFromSpoonacular = (queryString) => (dispatch) =>  {
  dispatch(fetchRecipesFromSpoonacularRequest());    
  return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=${queryString}&limitLicense=false&number=20&ranking=1`, {
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                       'content-type': 'application/json' },
            method: 'GET', 
            mode: 'cors', 
            redirect: 'follow', 
            referrer: 'no-referrer', 
            })
  .then(response => response.json())
  .then(response => dispatch(fetchRecipesFromSpoonacularSuccess(response))) 
  .catch(error => dispatch(fetchRecipesFromSpoonacularError(error)));
};

export const fetchRecipesFromSpoonacularById = (id) => (dispatch) => {
  dispatch(fetchSingleRecipeFromFromSpoonacularRequest());
  return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${id}/information`, {
          cache: 'no-cache', 
          credentials: 'same-origin',
          headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                  'content-type': 'application/json' },
          method: 'GET', 
          mode: 'cors', 
          redirect: 'follow', 
          referrer: 'no-referrer', 
          })
  .then(results => results.json() )        
  .then(recipe =>  dispatch(fetchSingleRecipeFromSpoonacularSuccess(recipe)))
  .catch(error => dispatch(fetchSingleRecipeFromSpoonacularError(error)));
};
export const fetchRecipesFromSpoonacularInBulk = (idString) => (dispatch) => {
  dispatch(fetchRecipesInbulkFromSpoonacularRequest());
  return fetch(`https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/informationBulk?ids=${idString}`, {
            cache: 'no-cache', 
            credentials: 'same-origin',
            headers: { 'X-Mashape-Key': process.env.MASHAPE_KEY,
                       'content-type': 'application/json' },
            method: 'GET', 
            mode: 'cors', 
            redirect: 'follow', 
            referrer: 'no-referrer', 
            })
  .then(results => results.json())        
  .then(recipes => dispatch(fetchRecipesInbulkFromSpoonacularSuccess(recipes)))
  .catch(error => dispatch(fetchRecipesInbulkFromSpoonacularError(error)));
};

export const registerUser = user => dispatch => {
  return fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(user)
      })
  .then(res => normalizeResponseErrors(res))
  .then(res => res.json())
  .catch(err => {
          const {reason, message, location} = err;
          if (reason === 'ValidationError') {
            return Promise.reject(
              new SubmissionError({
                  [location]: message
                  })
              );
          }
      });
};

export const login = (username, password) => dispatch => {
  dispatch(authRequest());
  return (
      fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
          })
      .then(res => {
          normalizeResponseErrors(res);
          return res.json() 
          })
      .then(({ authToken, user }) => {
          storeAuthInfo(authToken, dispatch)
          })
      .catch(err => {
          const {code} = err;
          const message =
              code === 401
                  ? 'Incorrect username or password'
                  : 'Unable to login, please try again';
          dispatch(authError(err));
          return Promise.reject(
              new SubmissionError({
                  _error: message
              })
          );
      })
  );
};

export const signUp = (username, password) => dispatch => {
dispatch(authRequest());
return (
  fetch(`${API_BASE_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
      })
  .then(res => {
      normalizeResponseErrors(res);
      return res.json()
      })
  .then(({ authToken }) => storeAuthInfo(authToken, dispatch))
  .catch(err => {
      const {code} = err;
      const message =
          code === 401
              ? 'Incorrect username or password'
              : 'Unable to login, please try again';
      dispatch(authError(err));
      
      return Promise.reject(
          new SubmissionError({
              _error: message
              })
          );
      })
  );
};

export const refreshAuthToken = () => (dispatch, getState) => {
  dispatch(authRequest());
  const authToken = getState().auth.authToken;
  return fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {  Authorization: `Bearer ${authToken}`}
  })
  .then(res => normalizeResponseErrors(res))
  .then(res => res.json())
  .then(({ authToken }) => storeAuthInfo(authToken, dispatch))
  .catch(err => {
      dispatch(authError(err));
      dispatch(clearAuth());
  });
};















