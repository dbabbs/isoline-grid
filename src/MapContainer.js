import React from 'react';
import { Map, TileLayer, Marker, Polygon } from 'react-leaflet';
import { hereTileUrl } from './here';


export class MapContainer extends React.Component {

   constructor(props) {
      super(props);
      this.marker = React.createRef();
      this.map = React.createRef();
   }

   handleDrag = () => {

      const coordinates = this.marker.current.leafletElement.getLatLng();
      console.log(coordinates.lat, coordinates.lng)
      this.props.handleDrag(this.props.index, [coordinates.lat, coordinates.lng])
   }

   render() {

      return (
            <Map
               center={this.props.center}
               zoom={parseInt(this.props.options.zoom)}
               zoomControl={false}
               ref={this.map}
            >
               <TileLayer
                  url={hereTileUrl(this.props.style)}
               />
               <Marker
                  position={this.props.center}
                  draggable={true}
                  onDragEnd={this.handleDrag}
                  ref={this.marker}
               />
               {
                  this.props.polygon.length > 0 &&
                  <Polygon
                     positions={this.props.polygon}
                     color="#2DD5C9"
                  />
               }
            </Map>
      )
   }
}
