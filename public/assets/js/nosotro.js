// Coordenadas de las tiendas HuertoHogar en Chile
const storeLocations = [
    {
        city: "Santiago",
        lat: -33.4489,
        lng: -70.6693,
        address: "Av. Principal 123, Santiago Centro",
        phone: "+56 2 2345 6789"
    },
    {
        city: "Puerto Montt",
        lat: -41.4693,
        lng: -72.9424,
        address: "C Costanera 456, Puerto Montt",
        phone: "+56 65 2345 678"
    },
    {
        city: "Villarrica",
        lat: -39.2856,
        lng: -72.2279,
        address: "Av. Pedro de Valdivia 789, Villarrica",
        phone: "+56 45 2345 678"
    },
    {
        city: "Nacimiento",
        lat: -37.5061,
        lng: -72.6725,
        address: "Calle Central 321, Nacimiento",
        phone: "+56 43 2345 678"
    },
    {
        city: "Viña del Mar",
        lat: -33.0245,
        lng: -71.5518,
        address: "Av. Marina 654, Viña del Mar",
        phone: "+56 32 2345 678"
    },
    {
        city: "Valparaíso",
        lat: -33.0472,
        lng: -71.6127,
        address: "C Subida Ecuador 987, Valparaíso",
        phone: "+56 32 2345 679"
    },
    {
        city: "Concepción",
        lat: -36.8267,
        lng: -73.0617,
        address: "Av. O'Higgins 159, Concepción",
        phone: "+56 41 2345 678"
    }
];

// Inicializar el mapa cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    // Crear el mapa centrado en Chile
    const map = L.map('stores-map').setView([-35.6751, -71.5430], 6);
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Añadir marcadores para cada tienda
    storeLocations.forEach(store => {
        // Crear marcador personalizado
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: var(--accent-green); width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Añadir marcador al mapa
        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(map);
        
        // Crear contenido del popup
        const popupContent = `
            <div class="store-popup">
                <h4>HuertoHogar ${store.city}</h4>
                <p class="store-address">${store.address}</p>
                <p><i class="bi bi-telephone"></i> ${store.phone}</p>
                <p><i class="bi bi-geo-alt"></i> ${store.city}, Chile</p>
            </div>
        `;
        
        // Añadir popup al marcador
        marker.bindPopup(popupContent);
    });
    
    // Añadir control de escala
    L.control.scale({ metric: true, imperial: false }).addTo(map);
    
    // Ajustar el mapa al tamaño del contenedor
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Efecto hover para la lista de ciudades
document.querySelectorAll('.cities-list li').forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        // Aquí podrías añadir interacción con el mapa si lo deseas
        item.style.color = 'var(--accent-green)';
        item.style.fontWeight = '600';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.color = '';
        item.style.fontWeight = '';
    });
});