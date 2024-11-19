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

    const radiusMapping = { // Mapeando distancias com seus respectivos valores
        '1km': 1000,
        '5km': 5000,
        '10km': 10000,
    };

    // Initialize the map and circle
    useEffect(() => {
        const initMap = () => {
            const initialLocation = { lat: -23.550520, lng: -46.633308 }; // São Paulo

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

            // Move o centro do mapa quando o circulo for arrastado
            newCircle.addListener('dragend', () => {
                const newCenter = newCircle.getCenter();
                setCircleCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
                newMap.panTo(newCenter);
            });

            //  Atualiza o raio do circulo quando ele for alterado
            newCircle.addListener('radius_changed', () => {
                const newRadius = newCircle.getRadius();
                setCircleRadius(newRadius);

                // Atualiza o checkbox correspondente 
                // Verifica se o raio atual corresponde ao raio do mapeamento
                const matchingDistance = Object.entries(radiusMapping).find(
                    ([, radius]) => radius === newRadius
                );

                if (matchingDistance) { // Se o raio atual corresponder
                    setSelectedDistance(matchingDistance[0]); // Checa o checkbox correspondente
                } else {
                    setSelectedDistance(null); // Limpa o checkbox
                }
            });

            // Adiciona a barra de pesquisa ao mapa e configura o autocomplete
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current);
            autocomplete.bindTo('bounds', newMap);
            
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry || !place.geometry.location) return; // Manuseio de erro caso o lugar nao seja encontrado

                newMap.panTo(place.geometry.location); //Move o mapa para o lugar
                newMap.setZoom(15);
                newCircle.setCenter(place.geometry.location); //Move o circulo para o lugar
                setCircleCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }); //Atualiza o centro do circulo
            });
        };

        const loadScript = () => { // Carrega o script do google maps
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) { // Verifica se o script ja foi carregado
                const script = document.createElement('script'); // Cria o script
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`; // URL do script
                script.async = true;
                script.defer = true;
                script.setAttribute("loading", "lazy");  // Adds loading=lazy
                document.body.appendChild(script); // Adiciona o script

                script.onload = () => setMapLoaded(true); // Define que o mapa foi carregado
            } else {
                setMapLoaded(true); // Define que o mapa foi carregado
            }
        };

        if (!window.google) { // Verifica se o google maps ja foi carregado na pagina
            loadScript(); // Carrega o script do google maps caso nao tenha sido carregado
            window.initMap = initMap; // Define initMap como propriedade global
        } else {
            initMap(); // inicia o mapa com os parametros definidos
        }

        return () => {
            delete window.initMap; // Limpa a função global
        };
    }, []);

    // Manuseia mudanças no checkbox
    const handleCheckboxChange = (distance) => {
        setSelectedDistance(distance);

        if (circle) {
            const currentCenter = circle.getCenter(); // Get o centro atual
            circle.setRadius(radiusMapping[distance]); // Set o novo raio
            circle.setCenter(currentCenter); // Set o centro atual
        }
    };

    const jsonData = { // cria o json com as informacoes necessarias para a busca e notificaçao
        message: messageBody,
        title: messageTitle,
        latitude: Number(circleCenter.lat),  
        longitude: Number(circleCenter.lng), 
        radius: Number(circleRadius), 
    };
    
    const showSnackbar = (messageCode) => { // Mostra o snackbar
        const snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        setTimeout(() => { // Esconde o snackbar apos 3 segundos
          snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
        if (messageCode == 1) // Verifica o codigo da mensagem
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
    
    // Manuseia o envio do alerta
    const handleSendAlert = async () => {
        if (!messageTitle || !messageBody) { // Verifica se os campos estao preenchidos
            showSnackbar(3); // Mostra a mensagem de erro caso os campos nao estao preenchidos
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/push', { // Envia os dados para o servidor
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),  // Stringify o json para enviar
            });
    
            if (!response.ok) { // Verifica se a resposta foi bem sucedida
                showSnackbar(2); // Mostra a mensagem de erro caso a resposta nao for bem sucedida
                throw new Error(`Server error: ${response.status}`);
            }
            else {
                showSnackbar(1); // Mostra a mensagem de sucesso
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
