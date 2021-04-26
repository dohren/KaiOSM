<template>

    <div>

        <div class="menu">
            <kaiui-button title="Show position" v-on:softLeft="hideMenu" v-on:softCenter="showPosition" v-bind:softkeys="softkeys"/>
            <kaiui-button :title="titleTracking" v-on:softLeft="hideMenu" v-on:softCenter="startTracking" v-bind:softkeys="softkeys"/>
            <kaiui-button :title="titleInsomnia" v-on:softLeft="hideMenu" v-on:softCenter="setInsomnia" v-bind:softkeys="softkeys"/>
            <kaiui-button title="Load track" v-on:softLeft="hideMenu" v-on:softCenter="onFileBrowser" v-bind:softkeys="softkeys"/>
            <kaiui-button title="Close app" v-on:softLeft="hideMenu" v-on:softCenter="closeApp" v-bind:softkeys="softkeys"/>
        </div>   

        <kaiui-dialog
          title="Auswahl"
          v-model="showFileBrowser"
          v-bind:softkeys="softkeysDialog">
          <kaiui-list-item 
            :primaryText="file" 
            v-bind:softkeys="softkeysDialog"
            v-bind:key="file.name"
            v-on:softCenter="selectFile(file)"
            v-on:softLeft="showFileBrowser=false;"
            v-for="file in files" 
          />
        </kaiui-dialog>

        <kaiui-dialog
          title="Save"
          v-model="showSaveDialog"
          v-bind:softkeys="softkeysDialog"
          v-on:softLeft="showSaveDialog=false;">
          <kaiui-input label="Filename" placeholder="Input" v-model="filename"/>
          <kaiui-button title="Save" v-on:softLeft="showSaveDialog=false;" v-on:softCenter="saveTrack" v-bind:softkeys="softkeys"/>
          <kaiui-button title="Discard" v-on:softLeft="showSaveDialog=false;" v-on:softCenter="finishTracking" v-bind:softkeys="softkeys"/>
          <div class="bottom"></div>
        </kaiui-dialog>
        
    </div>
</template>

<script>

export default {
  name: 'Menu',
  props: {
    showMenu: Boolean,
    isTracking: Boolean,
    position: Array,
    settings: {},
    track: null,
  },
  data: () => ({
      softkeys: {
          left: "abbr",
          center: "Select",
          right: "",
      },
      softkeysDialog: {
          left: "cancel",
          center: "Select",
          right: "",
      },
      files: [],
      showFileBrowser: false,
      showSaveDialog: false,
      filename: ""
  }),
  methods: {
      hideMenu() {
          this.$emit('update:showMenu', false);
      },
      showPosition() {
           this.$emit('show-position');
      },
      closeApp() {
        window.close();
      },
      setInsomnia() {
        if (this.settings.isInsomnia) {
          this.settings.isInsomnia = false;
          this.vueInsomnia().off();
          this.showToast("Screen lock activated.");
        }
        else {
          this.settings.isInsomnia = true;
          this.vueInsomnia().on();
          this.showToast("Screen lock deactivated.");
        }
        this.$emit('update:showMenu', false);
      },
      startTracking(){
        if (this.position[1] == 0) {
          alert("Could not detrmine your position. Please try again...");
        }
        else if (this.isTracking) {
          this.showSaveDialog = true;
        } 
        else {
          this.showToast("Tracking started");
          this.$emit('update:isTracking', true);
          this.$emit('show-position');
      }  
    },
    onFileBrowser() {
      this.sdcard = navigator.getDeviceStorage('sdcard');
  
      var param = {
          since: new Date((+new Date()) - 31*24*60*60*1000),
      }

      var cursor = this.sdcard.enumerate(param);

      cursor.onerror = function (event) {
        console.log(event);
      }

      var temp = [];
      cursor.onsuccess = function () {
          if (this.result) {
              var file = this.result;
              // console.log("File updated on: " + file.lastModifiedDate);
              // console.log(file.name);
              var filename = file.name.substring(file.name.lastIndexOf("/") + 1, file.name.length);
              
              if (filename.includes(".gpx")){
                temp.push(filename);
              }
              this.continue();
          }
      }

      this.files = temp;
      this.showFileBrowser = true;
      this.selectFirstElement();

    },
    selectFile(filename) {
      this.showFileBrowser = false;

      var request = this.sdcard.get(filename);
      
      let $vm = this;
      
      request.onsuccess = function () {
        var file = this.result;
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
          $vm.settings.gpxData = event.target.result;
        }
        fileReader.readAsText(file);  
      }

      request.onerror = function () {
        console.warn("Unable to get the file: " + this.error);
      }
      this.$emit("update:settings", this.settings);
    },
    saveTrack() {
       if (this.filename.trim() === "") {
          this.showToast("Filename must not be empty.");
          return;
       }
       
        var gpxdata = this.createGPX(this.track, this.filename)

        var sdcard = navigator.getDeviceStorage("sdcard");
        var file   = new Blob([gpxdata], {type: "text/plain"});
        
        var request = sdcard.addNamed(file, this.filename + ".gpx");
        
        request.onsuccess = function () {
          var name = this.result;
          this.showToast("File "+ name + "saved.");
        }
        
        // An error typically occur if a file with the same name already exist
        request.onerror = function () {
          this.showToast('File could not be saved: ' + this.error);
        }  
        
        this.finishTracking();
    },
    finishTracking() {
      this.showToast("Tracking stopped.");
      this.$emit('clear-track');
      this.$emit('update:is-tracking', false);
      this.showSaveDialog = false;
    }
  },
  computed: {
    titleInsomnia: function () {
      return this.settings.isInsomnia ? "Activate screen lock" : "Deactivate screen lock";
    },
    titleTracking: function () {
      return this.isTracking ? "Stop tracking" : "Start tracking";
    }
  }
}

</script>

<style lang="css">
.bottom {
  height: 30px;
}

.kaiui-dialog-container {
  overflow: hidden !important;
}
.kaiui-listitem {
  min-height: 35px !important;
}
</style>
