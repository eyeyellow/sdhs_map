// TODO - Reorganize this into different files

// Class for holding the data
class Location {
  constructor({ name, folder_id, coordinates }) {
    this.title = name;
    this.folderId = folder_id;
    this.latLng = coordinates;
    this.marker = this.createMarker();
  }
  
  createMarker() {
    return L.circleMarker(this.latLng, {
      color: '#591845',
      fillOpacity: 0.5,
      radius: 5,
      weight: 2
    })
  }
}

// Initialize raw data
const locationsData = [
  {
    name: 'Mt. Baldhead Radar Station',
    folder_id: '95533ed0-033a-11ec-9a57-1f0085eee116',
    coordinates: [42.661, -86.210]
  },
  {
    name: 'Singapore, Michigan',
    folder_id: 'c362ddb0-5df1-11eb-a191-f399729d14b9',
    coordinates: [42.677, -86.206]
  },
  {
    name: 'Camp Gray',
    folder_id: '590f5ef0-6028-11eb-926c-21d02d648020',
    coordinates: [42.661, -86.215]
  }
];

// Spin up the classes
const locations = [];
locationsData.forEach((locationData) => {
  locations.push(new Location(locationData));
});

// Set up the markers
const markers = [];
locations.forEach((location) => {
  markers.push(location.marker);
});
const bounds = L.featureGroup(markers).getBounds().pad(.25);
const center = bounds.getCenter();

// Configure map
const map = L.map('map').setView(center, 4);
// Initialize map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
// Handle markers
markers.forEach(marker => marker.addTo(map));
map.fitBounds(bounds);
