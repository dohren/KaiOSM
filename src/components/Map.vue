<template>

    <div class="map-dialog" >
        <kaiui-header title="KaiOSM"/>

        <options 
          :settings.sync="settings" 
          :position="position"
          :is-tracking.sync="isTracking"
          :show-menu.sync="showMenu"
          :track="track"
          @show-position="showPosition" 
          @clear-track="clearTrack"
          v-if="showMenu" >
        </options>

        <kaiui-button 
          title="" 
          v-bind:softkeys="softkeys"
          v-on:softCenter="onFunctionKey"
          v-on:softLeft="onZoomOut"
          v-on:softRight="onZoomIn"
          id="invisible" 
          />

        <vl-map class="map" ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" >
          <vl-view 
            ref="view" 
            :center.sync="center" 
            :zoom.sync="zoom" >
          </vl-view>
          <route :route="settings.gpxData"/>

          <!-- vl-layer-tile>
            <! -- vl-source-xyz url="https://b.tile.openstreetmap.org/{z}/{x}/{y}.png" crossOrigin="anonymous"></vl-source-xyz -- >
            <vl-source-xyz url="http://andi-nas/proxy.php?tile={z}/{x}/{y}" crossOrigin="anonymous"></vl-source-xyz>
          </vl-layer-tile -->

          <vl-layer-tile>
            <component :is="'vl-source-osm'" v-bind="layer"></component>
          </vl-layer-tile>  
    
          <vl-feature>
            <vl-geom-line-string :coordinates="this.track"></vl-geom-line-string>
            <vl-style-box>
              <vl-style-stroke color="#006400" :width="3"></vl-style-stroke>
              <vl-style-circle :radius="3">
                <vl-style-stroke :width="1.5" color="#2979ff"></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-feature>

          <vl-geoloc @update:position="onUpdatePosition">
            <template slot-scope="geoloc">
              <vl-feature v-if="geoloc.position" id="position-feature">
                <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon  src="./assets/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
            </template>
          </vl-geoloc>
        </vl-map> 

    </div>
</template>


<script>
import Route from './Route.vue';
import Options from './Menu.vue'

export default {
  name: 'MapComponent',
  components: {
    Route,
    Options
  },
  props: {
    msg: String
  },
  data: () => ({
      settings: {
        gpxData: null,
        isInsomnia: false,
      },
      trackFeature: null,
      isTracking: false,
      center: [11.061859, 49.460983],
      position: [0,0],
      interactionTime: 0,
      zoom: 16,
      showMenu: false,
      delta: 0.0008,
      rotation: 0,
      softkeys: {
            left: "-",
            center: 'Menu',
            right: "+",
      },
      layer: [],
      features: [],
      track: [ [0,0] ]
      
  }),
  updated: function () {
  },
  methods: {
    onZoomIn() {
      this.zoom++;
    },
     onZoomOut() {
       this.zoom--;
    },
    showPosition(){
      this.showMenu = false;
      if (this.position[1] == 0) {
        this.showToast("Could not detrmine your position. Please try again...");
      }
      else {
        this.center = this.position;
        this.zoom = 16;
      }
    },
    onFunctionKey() { 
        this.showMenu = true; 
    },
    onUpdatePosition(coordinate) {
      this.position = coordinate;
      
      if (this.isTracking) {
        if (this.track[0][1] == 0) {
          this.track = [ coordinate ];
        }
        else {
          this.track.push(coordinate); 
        }

        var time = Math.floor(Date.now() / 1000);
        if (time > this.interactionTime) {
          this.center = this.position;
        }
      }
    },
    clearTrack() {
      this.track = [ [0,0] ];
    }
  },
  created() {

    let $vm = this;
    window.addEventListener("keydown", function(e) {
      if (!$vm.showMenu) {
        switch (e.key) { 
          case "ArrowLeft":
              $vm.center = [$vm.center[0] - $vm.delta, $vm.center[1]];
              break;
          case "ArrowRight":
              $vm.center = [$vm.center[0] + $vm.delta, $vm.center[1]];
             
              break;
          case "ArrowUp":
              $vm.center = [$vm.center[0], $vm.center[1] + $vm.delta];
              break;
          case "ArrowDown":
              $vm.center = [$vm.center[0], $vm.center[1] - $vm.delta];
              break;
        }
      }
      console.log(e.key);  
      switch (e.key) {  
          case "EndCall": 
            e.preventDefault();
            $vm.showToast("Please use the close button in the menu. This button is deactivated in case of unintentionally track loss.");
            break;
          case "Backspace": 
            e.preventDefault();
            $vm.selectCancel();
            break;
      }
    });

  },
  watch: {
    zoom: function() {
      this.delta = 52.4288 / parseFloat(2 ** this.zoom);
    },
    showMenu: function() {
      this.selectFirstElement();  
    },
    center: function() {
      this.interactionTime = Math.floor(Date.now() / 1000) + 5;
    }
  }
}
</script>

<style lang="sass">
  @import ~bulma/sass/utilities/_all

  html, body, #app
    width: 100%
    height: 100%
    margin: 0
    padding: 0

    .map
      height: 100%
      width: 100%

    .map-dialog
      height: 100%
      width: 100%

    .map-dialog .menu
      position: fixed 
      z-index: 2
      width: 100%
      height:100%
      background-color: rgba(0,0,0,0.5)

    .map-dialog .ol-zoom
      display: none
    
    #invisible
     height: 0px
     min-height: 0px
     margin: 0px

</style>