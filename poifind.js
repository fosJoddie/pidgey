
var mapdata=[];
var poitypes={};

var matchName= function(name,poitype) {
    // Quote metacharacters
    name=name.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
    name=name.replace('*','.*');
    
    var re=new RegExp(name, 'i');
    return function(el) {
        if(poitype && poitype!=el.poitype)  return false;
        if(!name) return false;
        return re.test(el.name)
    }
}

var getByNumber=function(idx) {
    return mapdata.filter(num => num.idx==idx);
}

var load = function(file) {
    var fs = require('fs');
    mapdata = JSON.parse(fs.readFileSync(file, 'utf8'));

    // Find all numbers which are part of names of pois
    var n, avoid={}, ptypes={};
    mapdata.forEach(el =>  {
	if (n=el.name.match(/\d+/g)) {
	    n.forEach(num => {
		avoid[num]=true;
	    })
	}
    });
    // Add a unique number to all pois, excluding numbers which 
    // are part of poi-names
    var j, i=100;
    for(j=0;j<mapdata.length;j++) {
        i++;
        while(avoid[i] != undefined) i++;
        
        mapdata[j].idx=i;
        ptypes[mapdata[j].poitype]=true;
    }
    poitypes=Object.keys(ptypes);
}



var find = function(name, poitype) {
    return mapdata.filter(matchName(name, poitype));
}

// Return single match if any
var singleMatch = function(mapres,name,poitype,returnExact = false) {

    // Single match
    if(mapres.length == 1)
	return mapres[0];

    // If exact match, return only this match
    if(returnExact) {
	var exactMatches=[]
	mapres.forEach(el =>  {
	    if(name.toLowerCase()==el.name.trim().toLowerCase()) {
		exactMatches.push(el);
	    }
	});
	if(exactMatches.length == 1) 
	    return exactMatches[0];
    }
}

var listResults = function(mapres) {
    var res = [];
    mapres.forEach(el => {
	res.push("" + el.poitype+": "+el.name + " _"+el.idx+"_")
    });
    return res;
}


var isPoiType = function(str) {
    return poitypes.includes(str);
}

var poiCount = function() {
    return mapdata.length;
}

module.exports = {
    load: load,
    listResults: listResults,
    singleMatch:singleMatch,
    getByNumber:getByNumber,
    isPoiType:isPoiType,
    find: find,
    poiCount: poiCount
}
