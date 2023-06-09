
export default async function (req, res) {
    var err = [];

    console.log("Inside accessItis.js")
    if (req.method === 'SEARCH') {
        var ret = await accessItis(req.body["species_name"], req.body["genus"], req.body["tsn"], err)
        console.log("Inside top itis access, ret is", ret)
        if (err.length > 0) {
            res.status(403).send({ error: err[0] });
        } else {
            res.status(200).send({
                ret:ret
                // data: ret
            })
        }
        
    }
}

async function accessItis(species_name, genus, tsn, errList){
    var test = false;


    if (test) {
        // tsn = 0
        tsn = 123
        // species_name = "Agave americana americana expansa"
        species_name = "Azotobacter indicus"
        // species_name = "no"
    }

    var species_genus = species_name + " " + genus;


    console.log("Searching for ", species_genus, " at tsn ", tsn);

    var tsnUrl = "https://services.itis.gov/?q=tsn:" + tsn

    console.log("TSN URL:", tsnUrl)

    var nameUrl = "https://services.itis.gov/?q=nameWOInd:" + species_genus
    nameUrl = nameUrl.replaceAll(" ", "\\\%20")


    const fetch = require("node-fetch");
      

    var response = await fetch(tsnUrl, {

            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            redirect: 'follow',
        })
        
    var jsonData = await response.json();
    console.log("Response:", jsonData.response);
        
    if (jsonData.response.numFound > 0) {
        // if (jsonData.response.docs[0].nameWOInd) {
        console.log("There is a name: ", jsonData.response.docs[0].nameWInd)
        if (jsonData.response.docs[0].nameWOInd == species_genus) {
            console.log(species_name, "matches", jsonData.response.docs[0].nameWInd);
            return jsonData;
        } else {
            errList.push("Name of species is invalid and doesn't match TSN")
            console.log ("Error: name of species is invalid and doesn't match TSN")
        }
    } else {
        errList.push("TSN doesn't exist")
        console.log("Error: TSN doesn't exist");
        console.log("Name url:", nameUrl)

        var res2 = await fetch(nameUrl, {
            
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            redirect: 'follow',
        })
        var jsonData2 = await res2.json()
        console.log("Returned data of name call:", jsonData2.response)

        if (jsonData2.response.numFound > 0) {
            console.log("TSN is invalid for but valid name", jsonData2.response.docs[0].nameWInd,". Did you mean tsn=", jsonData2.response.docs[0].tsn,"?")

        } else {
            errList.push("Name of species is invalid and doesn't match TSN")
            console.log ("Error: both name of species is invalid and doesn't match TSN")
        }
    }
    
    return jsonData
}