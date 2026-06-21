import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import flyer from '../../assets/images/flyer.svg';


class Flyer extends Component {

    render() {

        return (
            <div style={{ position: 'relative', width: '100%', height: '100%', background: 'white', padding: '20px', textAlign: "center", marginTop: '50px',display:"flex",justifyContent:"center" }}>
                <div style={{ width: '100%', height: '100%', maxWidth: '800px', border: "1px solid",position:'relative' }}>
                    <img aria-label='' alt='Sign up' src={flyer} style={{width:'100%', height:'100%'}} ></img>
                    <div style={{ position: 'absolute', bottom: '5px', right: '10px' }}>
                        <a href="/signup?c3VtbWl0PXRydWU=" >Click here to signup</a>
                    </div>
                </div>


            </div>
        )
    }
}

export default withRouter(Flyer);