import React from 'react'

class LookupCaller extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
       return(
           <dd><span onClick={null} className="action-value">{ null }</span> :{ null }</dd>
            )
    }
}
export default LookupCaller