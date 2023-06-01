import styles from './Navbar.module.css';

export default function TableView(props) {
    console.log("props",props)
    const dataList = props.data.data
    if (dataList === undefined){
        return <div></div>
    }
    console.log(props.data, dataList)
    if (props.data.length == 0){
        console.log("here")
        return <div>Cannot Find Results Matching Search Criteria</div>
    } 
    const headerList = props.data.headers//Object.keys(props.data[0])
    console.log("Header list", headerList)
    const firstRow = dataList[0];
    var bad_key = 0;
    return (
        <div id="responseTable">
            <div className={"table-styling-div"}>
                <table>
                    <thead>
                        <tr>
                            {headerList.map(header => <th key={header}>{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map(row => {
                            return (
                                <tr key={row.id}>
                                    {Object.values(row).map(value => <td key={bad_key++}>{(typeof(value) === "boolean") ? "[" + value.toString() + "]" : value}</td>)}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

