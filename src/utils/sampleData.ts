import { TrailData, TrailPoint } from '../types';

/**
 * Sample Highland Mary Trail data for demonstration
 * Per spec: Highland Mary Trail "drawing itself" as user scrolls
 */
export function loadSampleTrailData(): { trailData: TrailData; poiData: TrailPoint[] } {
  
  // Highland Mary Trail coordinates (Colorado)
  const trailData: TrailData = {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            -107.575507,
            37.771122
          ],
          [
            -107.576451,
            37.770138
          ],
          [
            -107.577438,
            37.769629
          ],
          [
            -107.581215,
            37.769222
          ],
          [
            -107.58203,
            37.76817
          ],
          [
            -107.58203,
            37.76739
          ],
          [
            -107.58276,
            37.767254
          ],
          [
            -107.583103,
            37.766339
          ],
          [
            -107.582417,
            37.766508
          ],
          [
            -107.582116,
            37.765524
          ],
          [
            -107.581344,
            37.765117
          ],
          [
            -107.579455,
            37.764439
          ],
          [
            -107.576795,
            37.761148
          ],
          [
            -107.577395,
            37.759689
          ],
          [
            -107.577996,
            37.759078
          ],
          [
            -107.577782,
            37.758196
          ],
          [
            -107.576623,
            37.756703
          ],
          [
            -107.576108,
            37.755855
          ],
          [
            -107.576065,
            37.755312
          ],
          [
            -107.576666,
            37.752462
          ],
          [
            -107.569971,
            37.749069
          ],
          [
            -107.557869,
            37.75253
          ],
          [
            -107.556581,
            37.762369
          ],
          [
            -107.556667,
            37.769697
          ],
          [
            -107.561903,
            37.77621
          ],
          [
            -107.573061,
            37.779941
          ],
          [
            -107.577524,
            37.778313
          ],
          [
            -107.575507,
            37.771122
          ],
        ]
      },
      properties: {
        name: 'Highland Mary Trail',
        difficulty: 'moderate',
        length_miles: 5.3,
        elevation_gain_ft: 1476
      }
    }]
  };

  // Points of interest along the trail
  const poiData: TrailPoint[] = [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.4567, 37.8234]
      },
      properties: {
        miles_from_start: 0,
        name: 'Trailhead',
        type: 'start'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.4856, 37.8413]
      },
      properties: {
        miles_from_start: 1.3,
        name: 'Meadow Viewpoint',
        type: 'viewpoint'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.5301, 37.8657]
      },
      properties: {
        miles_from_start: 2.7,
        name: 'Alpine Lake',
        type: 'landmark'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.5901, 37.8999]
      },
      properties: {
        miles_from_start: 3.9,
        name: 'Summit Ridge',
        type: 'viewpoint'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.8167, 38.0234]
      },
      properties: {
        miles_from_start: 5.3,
        name: 'Trail End',
        type: 'end'
      }
    }
  ];

  return { trailData, poiData };
}



