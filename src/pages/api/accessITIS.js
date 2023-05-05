
export default async function (req, res) {
    var err = [];

    console.log("Inside accessItis.js")
    //console.log("Req is", req)
    //console.log("Res is", res)
    if (req.method === 'SEARCH') {
        var ret = await accessItis(req.body["species_name"], req.body["tsn"], err)
        console.log("Inside top itis access, ret is", ret)
        if (err.length > 0) {
            res.status(401).send({ error: err[0] });
        } else {
            res.status(200).send({
                ret:ret
                // data: ret
            })
        }
        
    }
}

async function accessItis(species_name, tsn, errList){
    var test = true;

    if (test) {
        // tsn = 0
        tsn = 18
        species_name = "Agave americana americana expansa"
        // species_name = "no"
    }

    var url = "https://services.itis.gov/?q=tsn:566578"
    //var tsnUrl = "https://services.itis.gov/?q=tsn:" + tsn
    // var tsnUrl = "https://services.itis.gov/?q=tsn:" + 123
    var tsnUrl = "https://services.itis.gov/?q=tsn:" + tsn

    var tsnName = "https://services.itis.gov/?q=nameWOInd:"+species_name

    console.log("TSN URL:", tsnUrl)

    console.log("replacing nameUrl")
    var nameUrl = "https://services.itis.gov/?q=nameWOInd:" + species_name
    nameUrl = nameUrl.replaceAll(" ", "\\\%20")


    console.log("AccessItis arguments: species_name=",species_name," tsn=", tsn)
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
        if (jsonData.response.docs[0].nameWOInd == species_name) {
            console.log(species_name, "matches", jsonData.response.docs[0].nameWInd);
        } else {
            errList.push("Error: name of species is invalid and doesn't match TSN")
            console.log ("Error: name of species is invalid and doesn't match TSN")
        }
    } else {
        errList.push("Error: TSN doesn't exist")
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
            errList.push("Error: name of species is invalid and doesn't match TSN")
            console.log ("Error: both name of species is invalid and doesn't match TSN")
        }
    }
    // if (response.docs) {
    //     console.log("Yup")
    // }
                
    // console.log("Response outside fetch:", response.docs)
    // console.log("Type of data: ", typeof response)
    // return response
    return jsonData
}