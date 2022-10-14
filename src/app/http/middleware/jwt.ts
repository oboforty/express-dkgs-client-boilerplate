import { expressjwt } from "express-jwt";
import { getJWK } from "../../../infra/authentication/jwks";


export default expressjwt({
  secret: getJWK,
  //getToken: 
  algorithms: ["RS256"],
})
//.unless({
  // path: ["/token"]
