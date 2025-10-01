const coordinates = window.listingCoordinates;
const MAP_Token = window.MAP_Token;
const locationTitle = window.listingTitle;

if (coordinates && coordinates.length === 2) {
    
    const map = new maplibregl.Map({
        container: 'map',
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAP_Token}`, 
        center: coordinates, 
        zoom: 9
    });

    map.addControl(new maplibregl.NavigationControl());

    const popupOffsets = {
    'top': [0, 0],
    'top-left': [0, 0],
    'top-right': [0, 0],
    'bottom': [0, -30], 
    'bottom-left': [0, -30],
    'bottom-right': [0, -30]
};

    new maplibregl.Marker({ color: "#fe424d" }) 
        .setLngLat(coordinates)
        .setPopup(
        new maplibregl.Popup({ 
            offset: popupOffsets, 
        })
        .setHTML(`<h5>${listingTitle}</h5><p>Exact Location Provided after booking</p>`)
    )
        .addTo(map);
    
    console.log("Map initialized successfully.", coordinates);

} else {
  
    console.log("Value received from window:", coordinates);
    console.error("Coordinates data is missing or empty ([]). Map not loaded.");
}