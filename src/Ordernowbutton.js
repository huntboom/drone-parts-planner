import Button from '@mui/material/Button';
import { Link,Outlet } from "react-router-dom"; 

export default function Ordernowbutton() {
  return(
        <div className='orderbutton'>
            <Link to="/customizer">
        <Button style={{ borderRadius: 25,
        fontweight:0,
        color:'black',
        backgroundColor: "white",
        boxshadow: '5px 10px',
        padding: "18px 56px",
        fontSize: "18px",
    }} variant='contained'>ORDER NOW</Button>
            </Link>
          </div>
  );
}
