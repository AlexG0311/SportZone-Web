import {APIProvider, Map} from '@vis.gl/react-google-maps';

export default function Mapa() {

const API_KEY = 'AIzaSyBIujh25xtRi5la_Xj_D58GAB9NpHkQxFo';

     <APIProvider apiKey={API_KEY}>
    <Map
      style={{width: '100vw', height: '100vh'}}
      defaultCenter={{lat: 22.54992, lng: 0}}
      defaultZoom={3}
      gestureHandling='greedy'
      disableDefaultUI
    />
  </APIProvider>

}