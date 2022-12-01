import Search from "./Search"
import Absence from './Absence'
import datas from './data.json';

 export default function Main() {
    return (
        <div className="main-area">
            {
                datas.map(row => {
                    return <Absence data={row}/>
                })
            }
        </div>
    )
}