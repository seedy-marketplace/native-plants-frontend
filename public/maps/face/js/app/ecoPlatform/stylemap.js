
var OSBStyle = function (feature, resolution, select) {
  let parentId = feature.get('Manager');
  let fillcolor, defaultColor;
  switch (parentId) {
    case "Willapa NWR":
      defaultColor = [199,191,74,1];
      break;
    case "WDFW":
      defaultColor = [140,104,237,1];
      break;
    case "OPRD":
      defaultColor = [108,220,245,1];
      break;
    case "TNC":
      defaultColor = [184,77,81,1];
      break;
    case "CCRD":
      defaultColor = [62,171,80];
      break;
    case "California":
      defaultColor = [245,157,224];
      break;
      case "HRD":
      defaultColor = [84,119,171];
      break;
    case "NCLC":
      defaultColor = [125,148,99];
      break;
    case "NPS":
      defaultColor = [250,184,157];
      break;
    case "Nestucca NWR":
      defaultColor = [133,52,118];
      break;
    case "BLM":
      defaultColor = [250,184,157];
      break;
    default:
      defaultColor = [227,164,86];
      break;
  }
  fillcolor = (feature.get('color') && feature.get('color') != '') ? feature.get('color') : defaultColor;

  var style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#C9BFA7',
      opacity: select ? 0.8 : 0.5,
      width: select ? 3 : 0.5,
    }),
    fill: new ol.style.Fill({
      color: fillcolor,
      opacity: select ? 0.8 : 0.5,
    })
  });
  var label = feature.get('value') ? feature.get('value') : '';
  var textStyle = new ol.style.Style({
    geometry: function (feature) { //对multipolygon仅标注最大的多边形
      var geometry = feature.getGeometry();
      if (geometry.getType() == 'MultiPolygon') {
        var polygons = geometry.getPolygons();
        var widest = 0;
        for (var i = 0, ii = polygons.length; i < ii; ++i) {
          var polygon = polygons[i];
          var width = ol.extent.getWidth(polygon.getExtent());
          if (width > widest) {
            widest = width;
            geometry = polygon;
          }
        }
      }
      return geometry;
    },
    text: new ol.style.Text({
      overflow: true,
      text: feature.get('Manager') ? feature.get('Manager') : '',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 3
      })
    })
  });
  return [style, textStyle];
}

var gridStyle = function (feature, resolution, select) {
  let parentId = feature.get('US_L3CODE');
  let fillcolor, defaultColor;
  switch (parentId) {
    case "1":
      defaultColor = [199,191,74,1];
      break;
    case "2":
      defaultColor = [140,104,237,1];
      break;
    case "3":
      defaultColor = [108,220,245,1];
      break;
    case "4":
      defaultColor = [184,77,81,1];
      break;
    case "5":
      defaultColor = [62,171,80];
      break;
    case "6":
      defaultColor = [245,157,224];
      break;
      case "7":
      defaultColor = [84,119,171];
      break;
    case "8":
      defaultColor = [125,148,99];
      break;
    case "9":
      defaultColor = [250,184,157];
      break;
    case "10":
      defaultColor = [133,52,118];
      break;
    case "11":
      defaultColor = [250,184,157];
      break;
    case "77":
      defaultColor = [235,87,232];
      break;
      case "13":
      defaultColor = [148,101,56];
      break;
    case "14":
      defaultColor = [178,242,143];
      break;
    case "15":
      defaultColor = [97,250,97];
      break;
    case "78":
      defaultColor = [53,56,140];
      break;
    case "80":
      defaultColor = [52,130,133];
      break;
    case "81":
      defaultColor = [153,103,128];
      break;
      case "85":
      defaultColor = [84,235,177];
      break;
    default:
      defaultColor = [227,164,86];
      break;
  }
  fillcolor = (feature.get('color') && feature.get('color') != '') ? feature.get('color') : defaultColor;

  var style = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#C9BFA7',
      opacity: select ? 0.8 : 0.5,
      width: select ? 3 : 0.5,
    }),
    fill: new ol.style.Fill({
      color: fillcolor,
      opacity: select ? 0.8 : 0.5,
    })
  });
  var label = feature.get('value') ? feature.get('value') : '';
  var textStyle = new ol.style.Style({
    geometry: function (feature) { //对multipolygon仅标注最大的多边形
      var geometry = feature.getGeometry();
      if (geometry.getType() == 'MultiPolygon') {
        var polygons = geometry.getPolygons();
        var widest = 0;
        for (var i = 0, ii = polygons.length; i < ii; ++i) {
          var polygon = polygons[i];
          var width = ol.extent.getWidth(polygon.getExtent());
          if (width > widest) {
            widest = width;
            geometry = polygon;
          }
        }
      }
      return geometry;
    },
    text: new ol.style.Text({
      overflow: true,
      text: feature.get('US_L3CODE') ? feature.get('US_L3CODE') : '',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 3
      })
    })
  });
  return [style, textStyle];
}

var ecoStyle = function (feature, resolution, select) {
  
  var shadowStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [140, 186, 133, 0.15],
      width: select ? 3 : 0.5,
    }),
    zIndex: 1
  });
  var countryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      //color: [161, 131, 182, 0.8],
      color: [0, 116, 192, 0.8],
      width: select ? 3 : 0.5,
      lineCap: 'round',
      // lineDash: [5, 2]
    }),
    zIndex: 2
  });
  var textStyle = new ol.style.Style({
    geometry: function (feature) { //对multipolygon仅标注最大的多边形
      var geometry = feature.getGeometry();
      if (geometry.getType() == 'MultiPolygon') {
        var polygons = geometry.getPolygons();
        var widest = 0;
        for (var i = 0, ii = polygons.length; i < ii; ++i) {
          var polygon = polygons[i];
          var width = ol.extent.getWidth(polygon.getExtent());
          if (width > widest) {
            widest = width;
            geometry = polygon;
          }
        }
      }
      return geometry;
    },
    text: new ol.style.Text({
      overflow: true,
      text: feature.get('US_L3CODE') ? feature.get('US_L3CODE') : '',
      fill: new ol.style.Fill({
        color: '#000'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 3
      })
    })
  });
  return [shadowStyle, countryStyle,textStyle];
}

var regionStyle = function (feature, resolution, select) {
  var shadowStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [140, 186, 133, 0.15],
      width: 2
    }),
    zIndex: 1
  });
  var countryStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      //color: [161, 131, 182, 0.8],
      color: [0, 116, 192, 0.8],
      width: 1,
      lineCap: 'round',
      lineDash: [5, 2]
    }),
    zIndex: 2
  });
  return [shadowStyle, countryStyle];
}

$("#mgmt").click(mgmtClick);

function mgmtClick() {
  $.ajax({
    type : "GET",
    url : config.URL.OSBLayer,
    dataType : "json",
    success : function(result) {
      if(result.features!=null){
        if(result.features.length!=0){
          var features = (new ol.format.GeoJSON()).readFeatures(result,{
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          });

          commonMap.IBase.zoomToFeatures(ecoMap,features,16);
          //(features, 9000);
          // flashFeatures(features,9000);
        }
      }
    },
    error:function (xhr){//XMLHttpRequest, textStatus, errorThrown
      console.log("error");
      }
  });

}


