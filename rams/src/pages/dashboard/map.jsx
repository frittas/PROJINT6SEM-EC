import React, { useEffect } from 'react';

const Map = () => {
    useEffect(() => {
        const initMap = () => {
            const location = { lat: -23.550520, lng: -46.633308 }; // São Paulo, Brasil
            
            // Criando o mapa
            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: location,
            });

            // Marcador no mapa
            new window.google.maps.Marker({
                position: location,
                map: map,
            });
        };

        // Adicionando o script do Google Maps com a chave da API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        window.initMap = initMap; // Fazendo a função disponível globalmente
        document.body.appendChild(script);
        
        // Limpa o script quando o componente for desmontado
        return () => {
            document.body.removeChild(script);
            delete window.initMap;
        };
    }, []);

    return (
        <div style={{ height: '100%', width: '100%' }}> {/* Define altura do contêiner */}
            {/* Div onde o mapa será exibido */}
            <div id="map" style={{ height: '100%', width: '100%' }}></div> {/* Mapa ocupa 100% do contêiner */}
        </div>
    );
};

export default Map;
