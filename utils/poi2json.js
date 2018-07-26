#!/usr/bin/env node
//
// Sample script to create a poi.json file. 
//  
// This script Will take a list of CSV files with fields
// "Portal,Latitude,Longitude,*" as argument, and convert into a
// poi-file readable by pidgey.js. Duplicates are deleted. 
// 
// See for example
// https://www.reddit.com/r/TheSilphRoad/comments/7pq1cx/how_i_created_a_map_of_potential_exraids_and_how/
// for an idea how CSV files with coordinates can be obtained without
// breaking the TOS.



var fs = require('fs');
var parse = require('csv-parse/lib/sync');
var allpois=[];

var args = process.argv.slice(2);
args.forEach(function(el) {
    var records = parse(fs.readFileSync(el, 'utf8'));
    allpois=allpois.concat(records.map(function(rec) {
	return {
        "name": rec[0],
        "description": rec.length > 4 ? rec[4] : "",
        "image": rec.length > 5 ? rec[5] : "",
        "poitype": rec.length > 3 ? rec[3] : "portal",
        "latitude": parseFloat(rec[1]), 
        "longitude": parseFloat(rec[2])
    };
    }));
})

allpois=allpois.filter(function(el) {
    return ! ( el.name.length < 3 || isNaN(el.latitude) || isNaN(el.longitude ) )
})

seen={};

var poiid = function(el) {
    return (el.name+"/"+el.latitude+"/"+el.longitude);
    // Use this instead if the coordinates are not exact:
    // return (el[0].trim()+"/"+Math.round(el[2]*10000) +"/"+Math.round(10000*el[3]));
}


allpois=allpois.filter(function(el) {
    var k = poiid(el);
    if(seen[k]) {
	return false;
    } else {
	seen[k]=true;
	return true;
    }
});


console.log(JSON.stringify(allpois, null, "\t"));

// console.log(allpois.map(function(el) { return el.join("\t"); }).join("\n"));
