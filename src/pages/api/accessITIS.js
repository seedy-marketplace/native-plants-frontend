export default async function (req, res) {
    if (req.method === 'SEARCH') {
        var ret = await accessItis(req.body["species_name"], req.body["tsn"])
        res.status(200).json({
            ret:ret
        })
    }
}

async function accessItis(species_name, tsn){
    fetch(("https://www.itis.gov/ITISWebService/services/ITISService/searchByScientificName?srchKey="+species_name), {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'mode': 'no-cors',
                    },
                    credentials: 'include',
                    mode: 'no-cors',

                })
                    .then((res) => {
                        var retVal = res.json()
                        console.log("Res: ", res)
                        return retVal
                    })
                    .then(
                        (result) => {
                            console.log("Results:", result)
                        //   setIsLoaded(true);
                        //   setItems(result);
                        },
                        // Note: it's important to handle errors here
                        // instead of a catch() block so that we don't swallow
                        // exceptions from actual bugs in components.
                        (error) => {
                        //   setIsLoaded(true);
                          console.log("Error with accessing ITIS, ", error)
                        }
                    )

}