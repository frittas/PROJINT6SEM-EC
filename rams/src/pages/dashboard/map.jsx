import React, { useEffect, useState } from 'react';

const Map = () => {
    const [mapLoaded, setMapLoaded] = useState(false); // Rastreia se o mapa foi carregado
    const [selectedDistance, setSelectedDistance] = useState('1km'); // Rastreia a distância selecionada
    const [circle, setCircle] = useState(null); // Armazena a instância do círculo
    const [circleCenter, setCircleCenter] = useState({ lat: -23.550520, lng: -46.633308 }); // Armazena o centro do círculo
    const [circleRadius, setCircleRadius] = useState(1000); // Armazena o raio do círculo em metros

    const radiusMapping = {
        '1km': 1000,
        '5km': 5000,
        '10km': 10000,
    };

    useEffect(() => {
        const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: circleCenter,
            });

            const newCircle = new window.google.maps.Circle({
                map,
                center: circleCenter,
                radius: circleRadius, // Inicializa com o raio do estado
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                strokeWeight: 2,
                editable: true, // Permite edição do raio
                draggable: true, // Permite arrastar o círculo
            });

            // Atualiza o centro do círculo quando arrastado
            window.google.maps.event.addListener(newCircle, 'dragend', () => {
                const center = newCircle.getCenter();
                setCircleCenter({ lat: center.lat(), lng: center.lng() });
            });

            // Atualiza o raio do círculo quando editado
            window.google.maps.event.addListener(newCircle, 'radius_changed', () => {
                setCircleRadius(newCircle.getRadius()); // Armazena o novo raio
            });

            setCircle(newCircle);
        };

        const loadScript = () => {
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&v=weekly`;
                script.async = true;
                script.defer = true;
                script.setAttribute('loading', 'lazy'); // Prática recomendada para carregamento preguiçoso
                document.body.appendChild(script);

                script.onload = () => setMapLoaded(true);
            } else {
                setMapLoaded(true);
            }
        };

        if (!window.google) {
            loadScript();
            window.initMap = initMap; // Expondo initMap globalmente
        } else {
            initMap(); // Inicializa o mapa se já estiver disponível
        }

        return () => {
            delete window.initMap;
        };
    }, []);

    useEffect(() => {
        if (circle) {
            circle.setRadius(radiusMapping[selectedDistance]); // Atualiza o raio com base na seleção
            circle.setCenter(circleCenter); // Atualiza o centro do círculo
        }
    }, [selectedDistance, circle, circleCenter]); // Adiciona circleCenter como dependência

    const handleCheckboxChange = (distance) => {
        setSelectedDistance(distance);
    };

    const handleSendAlert = () => {
        // Imprime o raio selecionado e o ponto central do círculo no console
        console.log("Raio selecionado:", selectedDistance);
        console.log("Centro do círculo:", circleCenter);
        console.log("Raio atual do círculo:", circleRadius); // Imprime o raio atual armazenado
    };

    if (!mapLoaded) {
        return <p>Loading map...</p>;
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>

            <div id="map" style={{ height: '90%', width: '100%' }}></div>
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

            {/* Exibir o raio atual do círculo abaixo do mapa */}
            <p className='circleRadius' style={{ textAlign: 'center', marginTop: '10px' }}>
                Raio atual do círculo: {circleRadius / 1000} km
                <br />Latitude Atual do círculo:{circleCenter.lat}
                <br />Longitude Atual do círculo: {circleCenter.lng}
            </p>
        </div>
    );
};

export default Map;
