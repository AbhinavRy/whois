const { isValid } = require('tldjs');
const whois = require('whois');
const _ = require('lodash');
const { dataFilterReg, defaultReg } = require('./controller/util/dataFilter.js');

const url = 'google.au';
// const url = 'yahoo.com';

if(isValid(url)){
    whois.lookup(url, function(err, data) {
        let dataForFilter = defaultReg;
        const tld = url.split(".")[url.split(".").length - 1];
        const filters = dataFilterReg.find(x => x.tld === tld);
        if(filters){
            dataForFilter = filters;
        }
        let initialObj = {}
        dataForFilter.fieldNames.forEach(x => {
            initialObj[x.renamedAs] = "Not Known";
        })
        const obj = {
            url,
            ...initialObj,
        };
        console.log(data.match(dataForFilter.whoisData));
        data.match(dataForFilter.whoisData).map(x => {
            const r = x.replace(/\s\s+/g, ' ').split(dataForFilter.splitStr);
            const p = r[0].replaceAll(/[^A-Za-z0-9 ]/g, '');
            const requiredField = dataForFilter.fieldNames.findIndex(f => 
                f.regex
                    ?f.regex.test(_.camelCase(p))
                    :_.camelCase(p) === f.field
            );

            if(requiredField !== -1){
                obj[dataForFilter.fieldNames[requiredField].renamedAs] = r[1] || "Not Known";
            }
        })
        console.log(obj)
    })
}