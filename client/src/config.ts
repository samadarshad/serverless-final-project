// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it

export const apiEndpoint = `https://vrcrzzx032.execute-api.eu-west-2.amazonaws.com/dev` 
// export const apiEndpoint = `http://localhost:3003/dev`
export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'samadarshad.eu.auth0.com',            // Auth0 domain
  clientId: 'CAuysQoEuuxWV4Ui4zayLHSjWFBVsGUb',          // Auth0 client id
  // callbackUrl: 'http://localhost:3000/callback'
  callbackUrl: 'https://serverless-project-samadarshad.netlify.app/callback'
}
