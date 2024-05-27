import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Header from './Header'


    
function Protected(props)
{
    let Cmp=props.Cmp
    const navigate = useNavigate(); // useNavigate instead of useHistory
    useEffect(()=>{
        if(!localStorage.getItem('user-info'))
            {
                navigate("/register");

            }

    },[])

    

    

    return(
        <div>
            
            <Cmp/>
            
        </div>
    )
}
export default Protected