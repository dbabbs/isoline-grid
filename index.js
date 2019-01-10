
const $ = (q) => document.querySelector(q);

const hereCredentials = {
   id: 'UQ75LhFcnAv0DtOUwBEA',
   code: 'f5nyezNmYF4wvuJqQgNSkg'
}

//TODO: 5. Get Map Tile Url from dev poral
const hereTileUrl = `https://2.base.maps.api.here.com/maptile/2.1/maptile/newest/reduced.day/{z}/{x}/{y}/512/png8?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&ppi=320`;

const hereIsolineUrl = (coords, options) => `https://isoline.route.api.here.com/routing/7.2/calculateisoline.json?app_id=${hereCredentials.id}&app_code=${hereCredentials.code}&mode=shortest;${options.mode};traffic:${options.traffic}&start=geo!${coords[0]},${coords[1]}&range=${options.range}&rangetype=${options.type}`

const locations = [
   {
      name: 'Seattle, WA',
      coordinates: [47.605779, -122.315744]
   },
   {
      name: 'San Francisco, CA',
      coordinates: [37.761732, -122.440343]
   },
   {
      name: 'New York City, NY',
      coordinates: [40.734238, -73.988188]
   },
   {
      name: 'Berlin, Germany',
      coordinates: [52.520609, 13.409321]
   },
   {
      name: 'Chicago, IL',
      coordinates: [41.884314, -87.630478]
   },
   {
      name: 'Singapore, Singapore',
      coordinates: [1.347920, 103.862097]
   },
   {
      name: 'Buenos Aires, Argentina',
      coordinates: [-34.609855, -58.443259]
   },
   {
      name: 'Johannesburg, South Africa',
      coordinates: [-26.205689, 28.042450]
   },
   {
      name: 'Hong Kong, SAR China',
      coordinates: [22.316246, 114.174539]
   }
]

const OPTIONS = ['type', 'range', 'mode', 'traffic'];

OPTIONS.forEach(key => {
   document.getElementById(key).onchange = buildMaps;
})

let items = 9;
const maps = [];
function buildMaps() {

   const options = {
      type: $('#type').options[$('#type').selectedIndex].value,
      // range: $('#range').value,
      mode: $('#mode').options[$('#mode').selectedIndex].value,
      traffic: $('#traffic').options[$('#traffic').selectedIndex].value

   };
   if (options.type === 'time') {
      //seconds to minutes
      options.range = $('#range').value;
      options.rangeText = $('#range').value / 60;
      $('#range').max = 20000;
   } else if (options.type === 'distance'){
      //meters to miles
      console.log('he')
      options.range = $('#range').value;
      options.rangeText = $('#range').value / 1609.34;
      $('#range').max = 400000;
   }
   $('#slider-val').innerText = Math.round(options.rangeText * 100) / 100;
   console.log(options)


   $('#container').innerHTML = '';
   for (let i = 0; i < items; i++) {

      const div = document.createElement('div');
      div.id = 'map' + i;
      div.classList.add('map')
      $('#container').appendChild(div);

      const map = L.map('map' + i, {
         center: locations[i].coordinates,
         zoom: 10,
         layers: [L.tileLayer(hereTileUrl)],
         zoomControl: false
      });
      const marker = L.marker(locations[i].coordinates, {
         draggable: true
      }).addTo(map);

      marker.on('dragend', (event) => {
         const coordinates = [marker.getLatLng().lat, marker.getLatLng().lng];

         locations[i].coordinates = coordinates;

         map.eachLayer((layer) => {

            if (layer.hasOwnProperty('options') && layer.options.color == 'red' ) {

                  map.removeLayer(layer);


            }
         });

         fetch(hereIsolineUrl(coordinates, options)).then(res => res.json()).then(res => {

            const isoline = res.response.isoline[0].component[0].shape.map(x => [x.split(',')[0], x.split(',')[1]]);

            const polygon = L.polygon(isoline, {color: 'red'}).addTo(map);
         });
      })
      maps.push(map);

      fetch(hereIsolineUrl(locations[i].coordinates, options)).then(res => res.json()).then(res => {

         const isoline = res.response.isoline[0].component[0].shape.map(x => [x.split(',')[0], x.split(',')[1]]);

         const polygon = L.polygon(isoline, {color: 'red'}).addTo(map);
      });

   }
}

buildMaps();
document.getElementById('zoom').onchange = () => {
   $('#zoom-val').innerText = document.getElementById('zoom').value;
   maps.forEach((map) => {
      console.log(map)
      map.setZoom(document.getElementById('zoom').value)
   })
}
