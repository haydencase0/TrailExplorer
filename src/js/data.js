const TRAILS_DATA_URL = "/data/hike-info.json";
const USFS_API_URL =
  "https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TrailNFSPublish_01/MapServer/0/query";

export async function fetchTrailsData() {
  const response = await fetch(TRAILS_DATA_URL);
  if (!response.ok) throw new Error("Failed to load trail data");
  const data = await response.json();
  return Array.isArray(data?.trails) ? data.trails : [];
}

// For future use if want to connect to full API - Currently does nothing
export async function fetchUSFSTrails() {
  const params = new URLSearchParams({
    geometry: "-113.0,42.0,-111.0,44.0",
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    where: "TERRA_MOTORIZED='N'",
    outFields:
      "trail_name,trail_no,gis_miles,trail_class,trail_surface,typical_trail_grade,special_mgmt_area",
    returnGeometry: "false",
    f: "geojson",
  });

  const response = await fetch(`${USFS_API_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to load USFS trail data");
  return response.json();
}