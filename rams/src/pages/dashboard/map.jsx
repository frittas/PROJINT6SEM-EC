import React, { useEffect, useState, useRef } from 'react';
import { FaSearch} from 'react-icons/fa';

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
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

    const jsonData = {
        message: messageBody,
        title: messageTitle,
        latitude: Number(circleCenter.lat),  // Ensuring it's a number
        longitude: Number(circleCenter.lng),  // Ensuring it's a number
        radius: Number(circleRadius),  // Ensuring it's a number
    };
    
    const showSnackbar = (messageCode) => {
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        setTimeout(() => {
          snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
        if (messageCode == 1)
        {
            setSnackbarMessage(`Alerta enviado com sucesso!`);
        }
        else if (messageCode == 2)
        {
            setSnackbarMessage(`Erro ao enviar alerta!`);
        }
        else if (messageCode == 3)
        {
            setSnackbarMessage(`Preencha todos os campos!`);
        }
        else
        { 
            setSnackbarMessage(`Erro ao enviar alerta!`);
        }
      };
    
    // Handle alert button click
    const handleSendAlert = async () => {
        if (!messageTitle || !messageBody) {
            showSnackbar(3);
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),  // Stringify the object before sending
            });
    
            if (!response.ok) {
                showSnackbar(2);
                throw new Error(`Server error: ${response.status}`);
            }
            else {
                showSnackbar(1);
            }
            const result = await response.json();
            console.log('Response from server:', result);
        } catch (error) {
            console.error('Error sending data:', error);
            showSnackbar(2);
        }
    };
    

    if (!mapLoaded) return <p>Loading map...</p>;

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {/* Search bar */}
            <div className="searchBarContainer">
                <FaSearch className='searchIcon'/>
                <input
                    className="inputSearchBar"
                    type="text"
                    placeholder="Buscar local..."
                    ref={searchInputRef}
                />
            </div>
            <div className='inputContainer'>
                {/* Title input */}
                <input
                    className='inputMessageTitle'
                    type="text"
                    placeholder="Titulo"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    ></input>

                {/* Message input */}
                <input
                    className='inputMessage'
                    type="text"
                    placeholder="Mensagem"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    ></input>
            </div>
            {/* Map */}
            <div 
            id="map"
            style={{ height: '80%', width: '100%' }}
            
            ></div>

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

            {/* Snackbar*/}
            <div id="snackbar">
		        <p>
			        {snackbarMessage}
		        </p>
	        </div>
        </div>
    );
};

export default Map;
