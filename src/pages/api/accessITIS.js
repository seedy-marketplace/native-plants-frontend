
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
    // var url = "https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+species_name
    // var url = "https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey=procera"
    // var url = "https://services.itis.gov/"
    var url = "https://services.itis.gov/?q=tsn:182662"
    
    // var XMLHttpRequest = require('xhr2');
    // const req = new XMLHttpRequest();
    // req.open("GET", url);
    // req.overrideMimeType("text/plain; charset=x-user-defined");
    // console.log("XMLHTTPREQUEST: ",req)
    // req.onload = (e) => {
    //     const arraybuffer = req.response; // not responseText
    //     console.log("Array buffer:", arraybuffer)
    //   };

    console.log("AccessItis arguments: species_name=",species_name," tsn=", tsn)
    const fetch = require("node-fetch");
      

    // const response = await fetch(url, {
    const response = await fetch(url, {

            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            redirect: 'follow',
        })
    // const response = await fetch(url)
        // .then((res) => {
        //             // console.log("Json: ", res.json())
        //             // return (res.json())
        //             console.log("Initial res", res);
        //             var text = res.json()
        //             console.log("Res text", text)
        //             // console.log("Call returns ", res.text());
        //             // console.log("Call returns ", JSON.parse(text));

        //             return res;
        //         })

        .then(res=>res.json())
                
    console.log("Response outside fetch:", response)
    console.log("Type of data: ", typeof response)
    // const responseJson = await response.json
    // console.log("Response json:", responseJson)
    return response
}