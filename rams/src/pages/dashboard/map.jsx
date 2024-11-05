import React, { useEffect, useState, useRef } from 'react';

const Map = () => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [map, setMap] = useState(null);
    const [circle, setCircle] = useState(null);
    const [circleRadius, setCircleRadius] = useState(1000);
    const [circleCenter, setCircleCenter] = useState({ lat: -23.550520, lng: -46.633308 });
    const [selectedDistance, setSelectedDistance] = useState('1km');
    const searchInputRef = useRef(null);
    const [messageTitle, setMessageTitle] = useState('');
    const [messageBody, setMessageBody] = useState('');

    const radiusMapping = {
        '1km': 1000,
        '5km': 5000,
        '10km': 10000,
    };

    // Initialize the map and circle
    useEffect(() => {
        const initMap = () => {
            const initialLocation = { lat: -23.550520, lng: -46.633308 };

            const newMap = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: initialLocation,
            });
            setMap(newMap);

            const newCircle = new window.google.maps.Circle({
                map: newMap,
                center: initialLocation,
                radius: circleRadius,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeWeight: 2,
                editable: true,
                draggable: true,
            });

            setCircle(newCircle);

            // Keep track of the center when the circle is moved
            newCircle.addListener('dragend', () => {
                const newCenter = newCircle.getCenter();
                setCircleCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
                newMap.panTo(newCenter);
            });

            // Keep track of the radius when changed manually
            newCircle.addListener('radius_changed', () => {
                const newRadius = newCircle.getRadius();
                setCircleRadius(newRadius);

                // Update the selected distance checkbox if radius matches a known value
                const matchingDistance = Object.entries(radiusMapping).find(
                    ([, radius]) => radius === newRadius
                );

                if (matchingDistance) {
                    setSelectedDistance(matchingDistance[0]);
                } else {
                    setSelectedDistance(null); // Uncheck all if no match
                }
            });

            // Add autocomplete to the search input
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
            autocomplete.bindTo('bounds', newMap);

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry || !place.geometry.location) return;

                newMap.panTo(place.geometry.location);
                newMap.setZoom(15);
                newCircle.setCenter(place.geometry.location);
                setCircleCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
            });
        };

        const loadScript = () => {
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);

                script.onload = () => setMapLoaded(true);
            } else {
                setMapLoaded(true);
            }
        };

        if (!window.google) {
            loadScript();
            window.initMap = initMap;
        } else {
            initMap();
        }

        return () => {
            delete window.initMap;
        };
    }, []);

    // Handle checkbox changes
    const handleCheckboxChange = (distance) => {
        setSelectedDistance(distance);

        if (circle) {
            const currentCenter = circle.getCenter(); // Get the current center
            circle.setRadius(radiusMapping[distance]); // Set the new radius
            circle.setCenter(currentCenter); // Maintain the current position
        }
    };

    // Handle alert button click
    const handleSendAlert = () => {
        alert(`Titulo: ${messageTitle}\nmensagem: ${messageBody}\nRaio: ${circleRadius / 1000} km\nLatitude: ${circleCenter.lat}\nLongitude: ${circleCenter.lng}`);
    };

    if (!mapLoaded) return <p>Loading map...</p>;

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {/* Search bar */}
            <input
                className='inputSeachBar'
                type="text"
                placeholder="Buscar local..."
                ref={searchInputRef}

            />
            <input
                className='inputMessegeTitle'
                type="text"
                placeholder="Titulo"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                ></input>
            {/* Map */}
            <div id="map" style={{ height: '80%', width: '100%' }}></div>

            {/* Radius options */}
            <div className='optionsDashboard' style={{ padding: '10px' }}>
                <label>
                    <input
                        type='checkbox'
                        checked={selectedDistance === '1km'}
                        onChange={() => handleCheckboxChange('1km')}
                    />{' '}
                    1km
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={selectedDistance === '5km'}
                        onChange={() => handleCheckboxChange('5km')}
                    />{' '}
                    5km
                </label>
                <label>
                    <input
                        type='checkbox'
                        checked={selectedDistance === '10km'}
                        onChange={() => handleCheckboxChange('10km')}
                    />{' '}
                    10km
                </label>
            </div>

            <button type="button" className="buttonSendAlert" onClick={handleSendAlert}>
                Enviar Alerta
            </button>

            {/* Display current radius and center */}
            <p className='circleRadius' style={{ textAlign: 'center', marginTop: '10px' }}>
                Titulo: {messageTitle}
                <br />mensagem: {messageBody}
                <br />Raio atual do círculo: {circleRadius / 1000} km
                <br />Latitude Atual do círculo: {circleCenter.lat}
                <br />Longitude Atual do círculo: {circleCenter.lng}
            </p>
        </div>
    );
};

export default Map;
