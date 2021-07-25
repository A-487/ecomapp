import axios from 'axios'
import url from './URL'
import setupUser from './setupUser'
async function loginUser({ email, password }) {
  const response = await axios
    .post(`${url}/auth/local`, {
      identifier: email,
      password, //difference was that whenever we login we can do it by either email or username hence we put an identifier
    })
    .catch((error) => console.log(error))
  if (response) {
    setupUser(response)
  }

  return response
}

export default loginUser
