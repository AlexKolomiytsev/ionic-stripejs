export {};
declare global {
  interface Window {
    // portals context
    portalInitialContext: {
      value: { url: string, startingRoute: string, authToken: string, primaryColor: string, primaryTextColor: string, lightPrimaryColor: string, secondaryColor: string },
    }
  }
}
