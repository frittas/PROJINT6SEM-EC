import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
  const location = { lat: -23.550520, lng: -46.633308 }; // São Paulo, Brasil

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const onLoad = (map) => {
    console.log('Map loaded:', map);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={location}
        zoom={12}
        onLoad={onLoad}
      >
        <Marker position={location} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
