import {useSelector} from 'react-redux'
import { Outlet , Navigate} from "react-router-dom"

function PrivateRoute() {
    const currentUser = useSelector((state) => state.user)
    console.log(currentUser.currentUser)
  return currentUser.currentUser ? <Outlet/> : <Navigate to = '/sign-in'/>
}

export default PrivateRoute