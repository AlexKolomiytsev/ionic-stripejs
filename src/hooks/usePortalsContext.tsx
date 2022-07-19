import React, { FC, useContext, useReducer } from "react";

type PortalsContext = typeof window.portalInitialContext.value;

const initialState: PortalsContext = {
  url: 'https://staging.fisikal.com',
  startingRoute: '/flow_selection',
  authToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjUwYTdhYTlkNzg5MmI1MmE4YzgxMzkwMzIzYzVjMjJlMTkwMzI1ZDgiLCJ0eXAiOiJKV1QifQ.eyJleHRlcm5hbEd5bUNoYWluSWQiOiIxNzUiLCJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJSZWxvZ2luIiwiYm1hVXNlcklkIjoiN2VhN2JmZjMtZmUzNC00MDllLTg4MzktZGU5YTFhZTlhN2RmIiwiZWd5bVVzZXJJZCI6ImdwYnNuMGFtdHlscyIsIm1lbWJlcnNoaXBJZCI6InRlc3RfbWVtYmVyX2lkIiwiZW1haWwiOiJ0ZXN0X3JlbG9naW5AbWFpbGluYXRvci5jb20iLCJleHRlcm5hbEd5bUlkIjoiMTExMCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS90ZXN0LWdhbGF4eS1td2EiLCJhdWQiOiJ0ZXN0LWdhbGF4eS1td2EiLCJhdXRoX3RpbWUiOjE2NTEwNjgxOTAsInVzZXJfaWQiOiJmaXNpa2FsOjdlYTdiZmYzLWZlMzQtNDA5ZS04ODM5LWRlOWExYWU5YTdkZiIsInN1YiI6ImZpc2lrYWw6N2VhN2JmZjMtZmUzNC00MDllLTg4MzktZGU5YTFhZTlhN2RmIiwiaWF0IjoxNjU2OTMxNDkxLCJleHAiOjE2NTY5MzUwOTEsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnt9LCJzaWduX2luX3Byb3ZpZGVyIjoiY3VzdG9tIn19.pJexUOaBBONbS7SuqUjr_ni3usWWHiN7dDuoLgVCjZ_1zw9XDHdA2wunJFr0a7Fp7lBkey-i9kk2yZhNoo3MMRgzOLvSdAH7MYuxxd9pUL8WUOEDONMYGjkV4UqLXIzUAiNDq64DLE1eZX7SRq7whszCx74pMAxgDEbSQ02i98LSOVD5AeSzaSUxLyofuaJ92ZzCT_vXGK2Zsg2mN979q5QKBLnpw1D-wXxRuxVxl7P3i5NEmS28YUt5pWVJ7zm2eudVeIg703Adnze1B5ZKLhvBegi9g9cF0bIGIHLSK6pcGFVTSBKdHAQiFc0G3nA6YkAwsqniGfwalCVszR8RGw',
  primaryColor: '#DC020E',
  primaryTextColor: '#000000',
  lightPrimaryColor: '#FCEAEB',
  secondaryColor: '#413F3C' };

const types = {
  SET_PORTALS_CONTEXT: 'SET_PORTALS_CONTEXT',
  REMOVE_PORTALS_CONTEXT: 'REMOVE_PORTALS_CONTEXT'
}

type Action = {
  payload: Partial<PortalsContext>,
  type: typeof types.SET_PORTALS_CONTEXT | typeof types.REMOVE_PORTALS_CONTEXT
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case types.SET_PORTALS_CONTEXT:
      return {
        ...state,
        ...action.payload
      };
    case types.REMOVE_PORTALS_CONTEXT:
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

type ProviderProps = {
  initialContext: PortalsContext
}

type ContextType = {
  state: Partial<PortalsContext>;
  setPortalsState: (context: Partial<PortalsContext>) => void;
}

const PortalsStateContext = React.createContext<Partial<ContextType>>({});

export const PortalsProvider: FC<ProviderProps> = ({ children, initialContext }) => {
  const [state, dispatch] = useReducer(reducer, initialContext || initialState);

  const setPortalsState = (context: Partial<PortalsContext>) => {
    dispatch({
      type: types.SET_PORTALS_CONTEXT,
      payload: context
    })
  }

  return <PortalsStateContext.Provider value={{ state, setPortalsState }}>
    {children}
  </PortalsStateContext.Provider>
}

export const usePortalsContext = () => useContext(PortalsStateContext)
