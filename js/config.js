var appConfig = {
  improvementsLayer: "http://maps.co.bonneville.id.us/arcgis/rest/services/Parcels/MapServer/1",
  instrumentsLayer: "http://maps.co.bonneville.id.us/arcgis/rest/services/Parcels/MapServer/2",
  landLayer: "http://maps.co.bonneville.id.us/arcgis/rest/services/Parcels/MapServer/3",
  parcelsLayer: "http://maps.co.bonneville.id.us/arcgis/rest/services/Parcels/MapServer/0",
  parcelIdFieldName: "TextString",
  instrumentsParcelIdFieldName: "Pin",
  improvementsParcelIdFieldName: "Parcel_ID",
  landParcelIdFieldName: "Parcel_ID",
  parcelID: "",
  improvementsOutFieldNames: ["Extension","Category","ImpvID","ImpType","EffStatus","SqFeet","Value","YearBuilt","EffYrBuilt","Grade","Condition","PINStatus"],
  instrumentsOutFieldNames: ["Instrument_Number","Instrument_Date","Instrument_Type","Notes"],
  instrumentsOutDateFields: ["Instrument_Date"],
  landOutFieldNames: []
};