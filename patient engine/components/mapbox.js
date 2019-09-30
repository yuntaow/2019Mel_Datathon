import ReactMapGL from 'react-map-gl';


class Map extends React.Component {
  state = {
      viewport: {
          width: '85%',
          height: '100%',
          latitude: -37.8136,
          longitude: 144.9631,
          zoom: 10
      }
  };
  render() {
      return (
            <ReactMapGL
                mapStyle="mapbox://styles/yuntaow18/ck1376pgs0su81cn8n1zs7tlv"
                mapboxApiAccessToken="pk.eyJ1IjoieXVudGFvdzE4IiwiYSI6ImNqdDJxZXJ0YjF5cGk0NHF4dm10ZTZubjYifQ.vW2yZIv84lY1PpuxDSL2Sw"
                onViewportChange={(viewport) => this.setState({viewport})}
                {...this.state.viewport}
            />
      );
  }
}

export default Map
