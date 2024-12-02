import React, { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

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

    const mapContainerRef = useRef(null); // Ref para o container do mapa
    const radiusMapping = {
        '1km': 1000,
        '5km': 5000,
        '10km': 10000,
    };

    useEffect(() => {
        // Define a função initMap globalmente
        window.initMap = () => {
            
            if (mapContainerRef.current) {
                const initialLocation = { lat: -23.550520, lng: -46.633308 }; // São Paulo

                const newMap = new window.google.maps.Map(mapContainerRef.current, {
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

                newCircle.addListener('dragend', () => {
                    const newCenter = newCircle.getCenter();
                    setCircleCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
                    newMap.panTo(newCenter);
                });

                newCircle.addListener('radius_changed', () => {
                    const newRadius = newCircle.getRadius();
                    setCircleRadius(newRadius);

                    const matchingDistance = Object.entries(radiusMapping).find(
                        ([, radius]) => radius === newRadius
                    );

                    if (matchingDistance) {
                        setSelectedDistance(matchingDistance[0]);
                    } else {
                        setSelectedDistance(null);
                    }
                });

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

                setMapLoaded(true); // Sinaliza que o mapa foi carregado
            }
        };

        const loadScript = () => {
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
                script.async = true;
                script.defer = true;
                script.setAttribute("loading", "lazy");
                document.body.appendChild(script);
        
                script.onload = () => {
                    console.log("Google Maps script loaded");
                    setMapLoaded(true);
                };
            } else {
                setMapLoaded(true);
            }
        };
        

        loadScript();

        return () => {
            delete window.initMap; // Limpa a função global
        };
    }, []);

    const handleCheckboxChange = (distance) => {
        setSelectedDistance(distance);
        if (circle) {
            const currentCenter = circle.getCenter();
            circle.setRadius(radiusMapping[distance]);
            circle.setCenter(currentCenter);
        }
    };

    const jsonData = {
        message: messageBody,
        title: messageTitle,
        latitude: Number(circleCenter.lat),
        longitude: Number(circleCenter.lng),
        radius: Number(circleRadius/1000),
    };

    const showSnackbar = (messageCode) => {
        const snackbar = document.getElementById("snackbar");
        const messages = {
            1: { message: `Alerta enviado com sucesso!`, color: '#29ad65' },
            2: { message: `Erro ao enviar alerta!`, color: 'red' },
            3: { message: `Preencha todos os campos!`, color: 'red' },
            default: { message: `Erro ao enviar alerta!`, color: 'red' },
        };
        const { message, color } = messages[messageCode] || messages.default;
        snackbar.style.backgroundColor = color;
        snackbar.innerText = message;
        snackbar.className = "show";
        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
    };

    const handleSendAlert = async () => {
        if (!messageTitle || !messageBody) {
            showSnackbar(3);
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (!response.ok) {
                showSnackbar(2);
                throw new Error(`Server error: ${response.status}`);
            } else {
                showSnackbar(1);
            }

            const result = await response.json();
            console.log('Response from server:', result);
        } catch (error) {
            console.error('Error sending data:', error);
            showSnackbar(2);
        }
    };

    if (!mapLoaded) return <p>Carregando Mapa...</p>;

    return (
        <div style={{ height: '100%', width: '100%' }}>
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
                <input
                    className='inputMessageTitle'
                    type="text"
                    placeholder="Titulo"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                />
                <input
                    className='inputMessage'
                    type="text"
                    placeholder="Mensagem"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                />
            </div>

            <div ref={mapContainerRef} style={{ height: '80%', width: '100%' }}></div>

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

            <div id="snackbar">
                <p>{snackbarMessage}</p>
            </div>
        </div>
    );
};

export default Map;
