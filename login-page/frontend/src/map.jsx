import { useEffect, useRef } from 'react';

const Map = () => {
  const mapRef = useRef(null); // Referência para a div do mapa

  useEffect(() => {
    // Função de inicialização do mapa
    const initMap = () => {
      const location = { lat: -23.550520, lng: -46.633308 }; // São Paulo, Brasil

      // Cria o mapa dentro da referência da div
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: location,
      });

      // Adiciona um marcador na localização
      new window.google.maps.Marker({
        position: location,
        map: map,
      });
    };

    // Verifica se a API do Google Maps já foi carregada
    if (!window.google) {
      const script = document.createElement('script');
      script.src = ``;
      script.async = true;
      script.defer = true;
      script.onload = initMap; // Inicializa o mapa ao carregar o script
      document.head.appendChild(script);
    } else {
      initMap(); // Caso a API já esteja carregada
    }
  }, []);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;
