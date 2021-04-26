import Vue from 'vue'

Vue.mixin({
  methods: {   
    selectFirstElement() {
        let keydown = new KeyboardEvent("keydown", {
            key: 'ArrowUp', 
            bubbles: true,
            cancelable: true
          })
          setTimeout(() => document.body.dispatchEvent(keydown), 250);
    },
    selectCancel() {
        let keydown = new KeyboardEvent("keydown", {
            key: 'SoftLeft', 
            bubbles: true,
            cancelable: true
          })
          setTimeout(() => document.body.dispatchEvent(keydown), 50);
    },
    createGPX(track, name) {
      var ele = 0;
      var gpx = "<?xml version='1.0' encoding='UTF-8'?>";
      gpx = gpx.concat('<gpx version="1.1" creator="https://www.komoot.de" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">')
      gpx = gpx.concat('<metadata><name>' + name + '</name><author><link href="https://dohren.eu"><text>openmap</text><type>text/html</type></link></author></metadata>');
      gpx = gpx.concat('<trk>');
      gpx = gpx.concat('<name>' + name + '</name>');
      gpx = gpx.concat('<trkseg>');
      track.forEach(element => {
        gpx = gpx.concat('<trkpt lat="' + element[1] + '" lon="' + element[0] + '">');
        gpx = gpx.concat('<ele>' + ele + '</ele>');
        gpx = gpx.concat('</trkpt>');
      });
      gpx = gpx.concat('</trkseg></trk></gpx>');
    
      return gpx;
    }
  }
})