/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
requirejs(['./WorldWindShim',
    './LayerManager'],
    function (WorldWind,
        LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            { layer: new WorldWind.BMNGLayer(), enabled: true },
            { layer: new WorldWind.BMNGLandsatLayer(), enabled: false },
            { layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true },
            // WorldWindow UI layers.
            { layer: new WorldWind.CompassLayer(), enabled: true },
            { layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true },
            { layer: new WorldWind.ViewControlsLayer(wwd), enabled: true }
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

       
        $.getJSON("test.json")
            .done(function (data) {

                var attributes = new WorldWind.ShapeAttributes(null);
                attributes.outlineColor = WorldWind.Color.BLUE;
                attributes.outlineWidth = 2;
                attributes.interiorColor = new WorldWind.Color(1, 1, 1, 1.0);

                var locations = [];

                for (var i = 0; i < data.length; i++) {

                    var lat = parseFloat(data[i].reclat) 
                    var long = parseFloat(data[i].reclong)
                    var mass = parseInt(data[i].mass, 10)
                    if (lat && long && mass && lat>=-180 && lat<=180 && long>=-180 && long <=180)
                    {
                        if (mass > 10000) {
                            var x = new WorldWind.MeasuredLocation(lat, long, 10000);
                        }
                        else {
                            var x = new WorldWind.MeasuredLocation(lat, long, mass);
                        }
                         locations.push(x);
                    } 
                   
                  
                    
                    
                }
            
              
                wwd.addLayer(new WorldWind.HeatMapLayer("HeatMap", locations));
            });



    });