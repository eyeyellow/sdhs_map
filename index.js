// TODO - Reorganize this into different files

// Class for holding the data
class Location {
  constructor({ folder_id, coordinates }) {
    this.folderId = folder_id;
    this.latLng = coordinates;
    this.marker = this.createMarker();
  }
  
  createMarker() {
    return L.marker(this.latLng)
      // TODO - try to get the loading as a spinner
      .bindPopup(L.popup({ folderId: this.folderId, maxWidth: 200, content: 'Loading...' }));
  }
}

// Initialize raw data
const locationsData = [
  {
    // Mt. Baldhead Radar Station
    folder_id: '95533ed0-033a-11ec-9a57-1f0085eee116',
    coordinates: [42.661, -86.210]
  },
  {
    // Singapore, Michigan
    folder_id: 'c362ddb0-5df1-11eb-a191-f399729d14b9',
    coordinates: [42.677, -86.206]
  },
  {
    // Camp Gray
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

// Bind event handlers to map
map.on('popupopen', async (event) => {
  const popup = event.popup;
  // console.log(popup.options.folderId);
  const folderInfo = await getFolderInfo(popup.options.folderId);
  if (folderInfo.euid_representative) {
    const repFolderEntry = await getEntry(folderInfo.euid_representative);
    folderInfo.rep_entry = repFolderEntry;
  }
  popup.setContent(getPopupInfo(folderInfo));
});

// Popup info template
const getPopupInfo = function(folderInfo) {
  let popupInfo = `<h3>${folderInfo.name}</h3>`;
  if (folderInfo.description) {
    // clean up line breaks
    const description = folderInfo.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    popupInfo = popupInfo + `<div class="description">${description}</div>`;
  }
  if (folderInfo.rep_entry) {
    const [ media ] = folderInfo.rep_entry.media;
    popupInfo = popupInfo + `<img class="rep-image" src="${media.derivatives.public_thumbnail.path}"></img>`;
  }
  popupInfo = popupInfo + `<a href="${folderLink(folderInfo.id)}">See More</a>`;
  return `<div class="popup-info">${popupInfo}</div>`;
}

// CatalogIt API stuff
const SDHS_ACCOUNT_ID = 4124;

const folderLink = function(folderId) {
  return `https://hub.catalogit.app/${SDHS_ACCOUNT_ID}/folder/${folderId}`;
}

const folderRoute = function(folderId) {
  return `https://api.catalogit.app/api/public/accounts/${SDHS_ACCOUNT_ID}/folders/${folderId}`;
}

const entryRoute = function(entryId) {
  return `https://api.catalogit.app/api/public/entries/${entryId}`;
}

const getFolderInfo = async function(folderId) {
  const response = await fetch(folderRoute(folderId));
  if (response.ok) {
    return response.json();
  }
}

const getEntry = async function(repId) {
  const response = await fetch(entryRoute(repId));
  if (response.ok) {
    return response.json();
  }
}
