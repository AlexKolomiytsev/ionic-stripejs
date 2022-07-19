import { Capacitor } from '@capacitor/core';
import React from 'react';
import ReactDOM from 'react-dom';
import Portals from '@ionic/portals';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';

if (true) { 
  // useful to mock portals initial context when testing app locally in browser !Capacitor?.isNativePlatform()
  window.portalInitialContext = {
    value: {
      url: 'https://staging.fisikal.com',
      startingRoute: '/flow_selection',
      authToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUwYTdhYTlkNzg5MmI1MmE4YzgxMzkwMzIzYzVjMjJlMTkwMzI1ZDgiLCJ0eXAiOiJKV1QifQ.eyJleHRlcm5hbEd5bUNoYWluSWQiOiIxNzUiLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJSZWxvZ2luIiwiYm1hVXNlcklkIjoiN2VhN2JmZjMtZmUzNC00MDllLTg4MzktZGU5YTFhZTlhN2RmIiwiZWd5bVVzZXJJZCI6ImdwYnNuMGFtdHlscyIsIm1lbWJlcnNoaXBJZCI6InRlc3RfbWVtYmVyX2lkIiwiZW1haWwiOiJ0ZXN0X3JlbG9naW5AbWFpbGluYXRvci5jb20iLCJleHRlcm5hbEd5bUlkIjoiMTExMCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS90ZXN0LWdhbGF4eS1td2EiLCJhdWQiOiJ0ZXN0LWdhbGF4eS1td2EiLCJhdXRoX3RpbWUiOjE2NTEwNjgxOTAsInVzZXJfaWQiOiJmaXNpa2FsOjdlYTdiZmYzLWZlMzQtNDA5ZS04ODM5LWRlOWExYWU5YTdkZiIsInN1YiI6ImZpc2lrYWw6N2VhN2JmZjMtZmUzNC00MDllLTg4MzktZGU5YTFhZTlhN2RmIiwiaWF0IjoxNjU2OTMxNDkxLCJleHAiOjE2NTY5MzUwOTEsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.pJexUOaBBONbS7SuqUjr_ni3usWWHiN7dDuoLgVCjZ_1zw9XDHdA2wunJFr0a7Fp7lBkey-i9kk2yZhNoo3MMRgzOLvSdAH7MYuxxd9pUL8WUOEDONMYGjkV4UqLXIzUAiNDq64DLE1eZX7SRq7whszCx74pMAxgDEbSQ02i98LSOVD5AeSzaSUxLyofuaJ92ZzCT_vXGK2Zsg2mN979q5QKBLnpw1D-wXxRuxVxl7P3i5NEmS28YUt5pWVJ7zm2eudVeIg703Adnze1B5ZKLhvBegi9g9cF0bIGIHLSK6pcGFVTSBKdHAQiFc0G3nA6YkAwsqniGfwalCVszR8RGw',
      primaryColor: '#DC020E',
      primaryTextColor: '#000000',
      lightPrimaryColor: '#FCEAEB',
      secondaryColor: '#413F3C'
    },//, userPicture: '/img.jpg'
  };
}

Portals.getInitialContext<typeof window.portalInitialContext.value>().then((context : { value: { url: string; startingRoute: string; authToken: string; primaryColor: string; primaryTextColor: string; lightPrimaryColor: string; secondaryColor: string; } }) => {
  ReactDOM.render(
    <React.StrictMode>
      <App context={context.value} />
    </React.StrictMode>,
    document.getElementById('root')
  );
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('success registration', registration);
  },
  onUpdate: (registration) => {
    console.log('update registration', registration);

    const waitingServiceWorker = registration.waiting;

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", event => {
        // @ts-ignore
        if (event.target?.state === "activated") {
          window.location.reload()
        }
      });
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
