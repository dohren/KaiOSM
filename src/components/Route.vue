<template>
	<i style="display: none" class="route"/>
</template>

<script>
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import GPX from 'ol/format/GPX'; 

export default {
  name: 'Route',
  props: {
	route: String
  },
  data: () => ({
	gpxLayer: null,
  }),
  mounted() {
	this.createNavigationLayer();
  },
  methods: {
	createNavigationLayer() {
		let style = {
			'Point': new Style({
				image: new CircleStyle({
				fill: new Fill({
					color: 'rgba(255,255,0,0.4)'
				}),
				radius: 5,
				stroke: new Stroke({
					color: '#f60404 	',
					width: 1
				})
				})
			}),
			'LineString': new Style({
				stroke: new Stroke({
				color: '#f60404 	',
				width: 3
				})
			}),
			'MultiLineString': new Style({
				stroke: new Stroke({
				color: '#f60404 	',
				width: 3
				})
			})
		};

		this.gpxLayer = new VectorLayer({
		source: new VectorSource({
		format: new GPX(),
			url: 'assets/leer.gpx',
		}),
		style: function(feature) {
			return style[feature.getGeometry().getType()];
		}
		});
		this.gpxLayer.setZIndex(20);
		this.$parent.addLayer(this.gpxLayer);
    }
  },
  watch: {
	route: function (value) {
      let feature = (new GPX()).readFeatures(value, {featureProjection: 'EPSG:3857'})
      this.gpxLayer.getSource().clear();
      this.gpxLayer.getSource().addFeatures(feature);
    }
  }
}
</script>

