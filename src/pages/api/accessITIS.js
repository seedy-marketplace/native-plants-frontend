
export default async function (req, res) {
    console.log("Inside accessItis.js")
    if (req.method === 'SEARCH') {
        var ret = await accessItis(req.body["species_name"], req.body["tsn"])
        console.log("Inside top itis access, ret is", ret)
        res.status(200).send({
            ret:ret
            // data: ret
        })
    }
}

async function accessItis(species_name, tsn){
    var url = "https://services.itis.gov/?q=tsn:182662"

    console.log("AccessItis arguments: species_name=",species_name," tsn=", tsn)
    const fetch = require("node-fetch");
      

    const response = await fetch(url, {

            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            redirect: 'follow',
        })
        .then(res=>res.json())
                
    console.log("Response outside fetch:", response)
    console.log("Type of data: ", typeof response)
    return response
}