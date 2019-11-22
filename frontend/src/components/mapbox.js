import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import {Editor, EditorModes} from 'react-map-gl-draw';
import {FlyToInterpolator} from "react-map-gl";
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import ControlPanel from './control-panel';
import {getFeatureStyle, getEditHandleStyle} from './style';

import { setCors, openModal,retrieveData } from "../redux/actions";
import { connect } from "react-redux";



const TOKEN = "pk.eyJ1Ijoic21peWFrYXdhIiwiYSI6ImNqcGM0d3U4bTB6dWwzcW04ZHRsbHl0ZWoifQ.X9cvdajtPbs9JDMG-CMDsA";

class Mapp extends Component {
  constructor(props) {
    super(props);
    this._editorRef = null;
    this.state = {
      viewport: {
        longitude: 144.8661,
        latitude: -37.853,
        zoom: 9

      },
      mode: EditorModes.READ_ONLY,
      selectedFeatureIndex: null,
      features:[]
    };
  }

  mapRef = React.createRef();

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  handleOnResult = event => {
    this.setState({
      searchResultLayer: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10
      })
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  _onSelect = options => {
    this.setState({selectedFeatureIndex: options && options.selectedFeatureIndex});
  };

  _onDelete = () => {
    const selectedIndex = this.state.selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      this._editorRef.deleteFeatures(selectedIndex);
    }
  };

  _onUpdate = (a) => {
    if (a.editType === 'addFeature') {
      this.setState({
        mode: EditorModes.EDITING,
      });
    }
    // this.props.updateCoor([a.data])

    const data = a.data[0]["geometry"]["coordinates"][0]
    console.log(JSON.stringify(data))
    console.log(JSON.stringify({lon:data[0][0],lat:data[0][1],poly:data}))
    this.props.setCors({lon:data[0][0],lat:data[0][1],poly:data})
    this.props.openModal(true)
  };

  _renderDrawTools = () => {
    // copy from mapbox
    return (
      <div className="mapboxgl-ctrl-top-left">
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={() => this.setState({mode: EditorModes.DRAW_POLYGON})}
          />
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={this._onDelete}
          />
        </div>
      </div>
    );
  };

  render() {
    const {viewport, mode} = this.state;
    return (
      <MapGL
        ref={this.mapRef}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken={TOKEN}
        transitionInterpolator={new FlyToInterpolator()}
      >
        <Geocoder
          mapRef={this.mapRef}
          onResult={this.handleOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={TOKEN}
          position="top-right"
        />
        <Editor
          ref={_ => (this._editorRef = _)}
          style={{width: '100%', height: '100%'}}
          clickRadius={24}
          mode={mode}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
          editHandleShape={'circle'}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {this._renderDrawTools()}
      </MapGL>
    );
  }
}


export default connect(null, {setCors,openModal,retrieveData})(Mapp)
