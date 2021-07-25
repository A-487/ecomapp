import axios from 'axios'
import url from './URL'
import setupUser from './setupUser'
async function registerUser({ email, password, username }) {
  const response = await axios
    .post(`${url}/auth/local/register`, {
      username, //username: username ...but due to key es6 feature is key and variable are same then use only name
      email,
      password,
    })
    .catch((error) => console.log(error))
  if (response) {
    //if successfull reponse found then go to if(user) in login.svelte if error found go to else part + we need to clear the dashboard
    //setup user
    setupUser(response)
  }
  return response //return the response irrespective of fail aur success
}

export default registerUser
