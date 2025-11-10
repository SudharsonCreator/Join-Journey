// Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
          }) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
      maps: {
        Map: any;
        Marker: any;
        Geocoder: any;
        DirectionsService: any;
        DirectionsRenderer: any;
        TravelMode: any;
        Size: any;
      };
    };
  }
}

export {};