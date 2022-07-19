import { auth } from './const'

export const authorizeUser = async (authToken: string, url?: string) => {
  if(url) {
    auth.url = url;
  }
  var myHeaders = new Headers({ 'Content-Type' : 'application/json' });
  var body = { egym: { token : authToken} };
  var requestOptions = { method: "POST", headers: myHeaders,body: JSON.stringify(body) };

  try {
    let data = await fetch((url + '/api/unified/sessions/auth'), requestOptions);
    if (data.status === 404) {
      return false;
    }
    else {
        let response = await data.json();
        console.log("authorizeUser success");
        auth.fisikal_token = response.identity.fisikal_token;
        auth.club = response.club;
        return true;
    }
  }
  catch (e: any) {
    return false;
  }
}
