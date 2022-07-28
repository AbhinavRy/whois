const { isValid } = require('tldjs');
const whois = require('whois');
const _ = require('lodash');
const { dataFilterReg, defaultReg } = require('./util/dataFilter');
const { getDb } = require("../database");

const formatDateTime = (date) => {
    const d = new Date(date)
    const h =d.getUTCHours();
    const m = d.getUTCMinutes();
    const s = d.getUTCSeconds();
    const str = String(h).padStart(2, '0')+":"+String(m).padStart(2, '0')+":"+String(s).padStart(2, '0');
    const newDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    return newDate+" "+str;
}

const insertNewEntry = (conn, url) => {
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
            const resultObj = {
                url,
                ...initialObj,
            };
            data.match(dataForFilter.whoisData).map(x => {
                const r = x.replace(/\s\s+/g, ' ').split(dataForFilter.splitStr);
                const p = r[0].replaceAll(/[^A-Za-z0-9 ]/g, '');
                const requiredField = dataForFilter.fieldNames.findIndex(f => 
                    f.regex
                        ?f.regex.test(_.camelCase(p))
                        :_.camelCase(p) === f.field
                );
    
                if(requiredField !== -1){
                    if(dateFields.includes(dataForFilter.fieldNames[requiredField].renamedAs)){
                        r[1] = formatDateTime(r[1]);
                    }
                    resultObj[dataForFilter.fieldNames[requiredField].renamedAs] = r[1].replace(/^\s+|\s+$/g, '') || "Not Known";
                }
            })
            const values = [
                resultObj.url,
                resultObj.domain,
                resultObj.updated_date,
                resultObj.created_date,
                resultObj.expiration_date,
                resultObj.registrar,
                resultObj.reg_country
            ]
            var sqlQuery = `INSERT INTO sites (url, domain, updated_date, created_date, expiration_date, registrar, reg_country) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            conn.query(sqlQuery, values, function (err, result, fields) {
                if (err) throw err;
                if(result){
                    console.log("inserted a new entry.");
                    return resultObj;
                }
            });
        })
    }
    else{
        throw new Error("Invalid url.");
    }
}

const dateFields = ["updated_date", "created_date", "expiration_date"];

exports.getWhois = (req, res) => {
    const bodyData = req.body;
    let { url } = bodyData;
    const conn = getDb();
    url = url.replace(/^https?:\/\//, '');
    try {
        conn.query(`SELECT * FROM sites where url=?`, url, function (err, result, fields) {
            if(result.length > 0){
                console.log("found in db.");
                return res.status(200).json({ ...result[0] });
            }
            else{
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
                        const resultObj = {
                            url,
                            ...initialObj,
                        };
                        data.match(dataForFilter.whoisData).map(x => {
                            const r = x.replace(/\s\s+/g, ' ').split(dataForFilter.splitStr);
                            const p = r[0].replaceAll(/[^A-Za-z0-9 ]/g, '');
                            const requiredField = dataForFilter.fieldNames.findIndex(f => 
                                f.regex
                                    ?f.regex.test(_.camelCase(p))
                                    :_.camelCase(p) === f.field
                            );
                
                            if(requiredField !== -1){
                                if(dateFields.includes(dataForFilter.fieldNames[requiredField].renamedAs)){
                                    r[1] = formatDateTime(r[1]);
                                }
                                resultObj[dataForFilter.fieldNames[requiredField].renamedAs] = r[1].replace(/^\s+|\s+$/g, '') || "Not Known";
                            }
                        })
                        const values = [
                            resultObj.url,
                            resultObj.domain,
                            resultObj.updated_date,
                            resultObj.created_date,
                            resultObj.expiration_date,
                            resultObj.registrar,
                            resultObj.reg_country
                        ]
                        var sqlQuery = `INSERT INTO sites (url, domain, updated_date, created_date, expiration_date, registrar, reg_country) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        conn.query(sqlQuery, values, function (err, result, fields) {
                            if (err) throw err;
                            if(result){
                                console.log("inserted a new entry.");
                                return res.status(200).json(resultObj);
                            }
                        });
                    })
                }
                else{
                    throw new Error("Invalid url.");
                }
            }
        });
        
    } catch (error) {
        res.status(500).json({message: "Something went wrong."});
    }
}