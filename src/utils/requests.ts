import { auth } from './const';

let failedApiCall = false;

export const apiFetch = async (endpoint: string, params = "") => {
  console.log(auth.url + endpoint + params);
  if (failedApiCall === false) {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", this.props.authToken);
    myHeaders.append("X-Fisikal-Token", auth.fisikal_token);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000/");
    myHeaders.append("Accept", "application/json");
    var requestOptions: RequestInit = {
      // credentials: 'include',
      headers: myHeaders,
      method: "GET",  
    };

    try {
      let data = await fetch(
        auth.url + endpoint + params,
        requestOptions
      )
      if (data.status >= 400 && data.status < 600) {
        failedApiCall = true;
      } else {
        console.log(data.headers);
        let response = data.json();
        console.log("getFetch success");
        // console.log(response);
        return response;
      }
    } catch (e) {
      console.error(e);
      failedApiCall = true;
      return false;
    }
  }
};

export const apiPut = async (endpoint: string, body: any, tokenRequired: boolean) => {
  console.log(auth.url + endpoint);
  if (failedApiCall === false) {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", this.props.authToken);
    if(tokenRequired) {
      myHeaders.append("X-Fisikal-Token", auth.fisikal_token);
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000/");
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(body),
    };
    try {
      let data = await fetch(
        auth.url + endpoint,
        requestOptions
      );
      if (data.status >= 400 && data.status < 600) {
        failedApiCall = true;
      } else {
        let response = data.json();
        console.log("putFetch success");
        console.log(response);
        return response;
      }
    } catch (e) {
      console.error(e);
      failedApiCall = true;
      return false;
    }
  }
};

export const apiPostFetch = async (endpoint: string, body: any, tokenRequired: boolean) => {
  console.log(auth.url + endpoint);
  if (failedApiCall === false) {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", this.props.authToken);
    if(tokenRequired) {
      myHeaders.append("X-Fisikal-Token", auth.fisikal_token);
    }
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000/");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(body),
    };
    try {
      let data = await fetch((auth.url + endpoint), requestOptions);
      if (data.status === 404) {
        failedApiCall = true;
        return false;
      } else {
        let response = data.json();
        console.log("getPostFetch success");
        console.log(response);
        return response;
      }
    } catch (e) {
      console.error(e);
      failedApiCall = true;
      return false;
    }
  }
};

export const apiDelete = async (endpoint: string, body: any) => {
  console.log(auth.url + endpoint);
  if (failedApiCall === false) {
    var myHeaders = new Headers();
    // myHeaders.append("Authorization", this.props.authToken);
    myHeaders.append("Access-Control-Allow-Origin", "http://localhost:3000/");
    myHeaders.append("X-Fisikal-Token", auth.fisikal_token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
      body: JSON.stringify(body),
    };
    try {
      let data = await fetch((auth.url + endpoint), requestOptions);
      if (data.status === 404) {
        failedApiCall = true;
        return false;
      } else {
        let response = data.json();
        console.log("getDelete success");
        console.log(response);
        return response;
      }
    } catch (e) {
      console.error(e);
      failedApiCall = true;
      return false;
    }
  }
};