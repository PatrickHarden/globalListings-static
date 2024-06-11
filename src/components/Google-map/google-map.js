// import React from 'react'
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// const containerStyle = {
//   width: '100%',
//   height: 'calc(100vh - 120px)'
// };

// const center = {
//   lat: 39.8283,
//   lng: 98.5795
// };

// const Map = (props) => {
//   const [map, setMap] = React.useState(null)

//   const onLoad = React.useCallback(function callback(map) {
//     const bounds = new window.google.maps.LatLngBounds();
//     props.coordinateArray.forEach(coord => {
//       bounds.extend(
//         new window.google.maps.LatLng(coord.lat, coord.lng)
//       )
//     })
//     map.fitBounds(bounds);
//     setMap(map)
//   }, [])

//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null)
//   }, [])

//   return (
//     <LoadScript
//       googleMapsApiKey={'AIzaSyAnAZuRFSBSnD9GWQsuKINrIM-MSv-XYGk'}
//     >
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={2}
//         onLoad={onLoad}
//         onUnmount={onUnmount}
//         width={100}
//       >
//         {props.coordinateArray.map((coord, i) => (
//           <Marker
//             position={coord}
//             key={i + JSON.stringify(coord)}
//           />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   )
// }

// export default React.memo(Map)