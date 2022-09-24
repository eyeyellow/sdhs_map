const map = L.map('map').setView([42.585, -86.226], 13);

const locationsMap = [
  {
    name: 'Mt. Baldhead Radar Station',
    folder_id: '95533ed0-033a-11ec-9a57-1f0085eee116',
    coordinates: [42.661, -86.210]
  },
  {
    name: 'Singapore, Michigan',
    folder_id: 'c362ddb0-5df1-11eb-a191-f399729d14b9',
    coordinates: [42.676, -86.209]
  },
  {
    name: 'Camp Gray',
    folder_id: '590f5ef0-6028-11eb-926c-21d02d648020',
    coordinates: [42.661, -86.215]
  }
];

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
