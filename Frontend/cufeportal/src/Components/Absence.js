export default function Absence({data}) {
    return (
        <div className="absence-con">
            <div className="absence-info">
                <h3>{data.code}:{data.name}</h3>
            </div>
            <div className="absence-entries">
                {data.absence.map(entry => {
                    return (
                        <div className="absence-entry">
                            <p>Week: {entry.week}</p>
                            <p>Session: {entry.type}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}