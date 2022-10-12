import exp from 'constants';
import { NextFunction, Response } from 'express';

import {Secret} from 'jsonwebtoken';
import { expressjwt, Request } from 'express-jwt';

import jwkToPem from 'jwk-to-pem';
import httpMocks from 'node-mocks-http';

interface JWK_RSA_PRIV extends jwkToPem.RSA {
    // full specification of an actual JWK...
    use: "sig" | "enc",
    kid: string,
    alg: "RS256" | "RS512" // etc
}

describe('Test express-JWT capabilities', () => {
    /**
     * This case doesn't actually test app functionalities, but some POC for express-jwt
     */
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    const key_jwk_priv: JWK_RSA_PRIV = {
        "p": "9eq9GmafmnESRM_WRpWVj3A48OAtnb3_0NyCsgbUgpDGV300SyR6ZieUMtgRwz1KKqa-jGVIX6FhGd0sk7At2AtC9SD2TxU0eZ3bfJeYx0GgsNpg7n5QYiyQqoJ2P_RdMLoonAyMRav1j_T68ftkBHG-_fUU4wffq5Xhn09jLqE",
        "kty": "RSA",
        "q": "4eJMAwMg4jBbeg8iVEFjIHnRZCID9lDDm0w-IUzX72VhkmR90pnbxWEpHl1OhI1f9dJ1RMaRV7Gs0R2hXAy-AvKOTsqJvP8KAEMlFaGgkSXiBPpsPdbC5nARjK47pDeN6GE3mlMwA5gBLWx53s1I0JsiD8bApNF7LKUjsI_HmW8",
        "d": "TWLKDgYDZQI3z5mmTs33R1LbJPjDOfOdXytK_SsCLp5JV4PXDEi9swpGyFtnXVMKV6CnwbgdYoxkta7Mznbo2Byfd_TG-GVp6AWTXyTCL4MSdXd-ZqawZTUFlpmg5hU-nY5jXTh_dgWUnz_hWxHButfb9LUgtKfoJj5_4pQ_Sac_A0gVJwqafMUFS7zMZ0R2iZ499HjDP97TiPi_WyPMsxiiLUVqSpJCHVVHxmkJxmRibuMvpmVSOIpcBTG-J3XS5YtLWnMPHkWfKU3vI2G3sP8W7oazW4-25aVRZ1IGvssg8PMiydPYMVXxdgnKGVnJNk7lUfLLixZp6e6rok0BwQ",
        "e": "AQAB",
        "use": "sig",
        "kid": "XCVrpFMpHoGj6C7X5L7ZkbbTB0Wa3eb5mmaLuHZWgHw",
        "qi": "Pxcn7Vcgn7Et5y5cZyDOxONkLscWzZYVRyHHs2L2fE6no1sdikM5GdCL4HnW5XV11d_OrfSp1LZQ47_SqRZfoMKAlGbssx9CTRVRbs7A-Ch7UaYLpin-rxaeNg6tj-6tlLNp1pK8krEaYa1M2VdpxcliLZnNTnTJIwTP6S64zRk",
        "dp": "Rn7DNOVETX6qcQVvdI5-8D6IZCyvhu-nfNUptiUVGFSuNvhSXFQZrl0cM7MS7HgOYcmpCBAkvh1B-6sWk0PG8I7R4_lOAn-eqlphSAchKcWbbfc8IEIfgvUph2ecxFqluEk1SP6j23kfDOR6Z5HcKxX8XUq7cRWZvdNaeVPFp-E",
        "alg": "RS256",
        "dq": "jHce8ZiWcFHF8OdMX7yxmdZnAa-taxTaLs6ArFCOz03qGRDotXf8FIfQ_BLl6sPHcqRHTFd2tmPEpd2ZJBbAajDPkeudL6whWfxnKUZzBQ_bt2DKwsG0PXxfTW5jpEDvvBwIaa1lZDa4NLkKKCTcLOzrh4f-7_9ca2zd_sPKSX0",
        "n": "2Pyyc7pmREDv7iQZdZTWsG3n1hJWUOJ_JhcXGsH3lYs4gNyeHbk-ov_bDVqAAKPDQ1Z80oL2wIxGg9gz7h81OxtBxyhZbnw1SkmHz88fCELgpeQGa4C3yXh07ZRqgH_68tWzCpFlIgqybis59jLO0UgiDCtje2PdloJ4pWOMcmHc0rXQBZuSGif3SUe1I12l5K6Y_VEK73jWm3ndp3QO76G2OiVsLSnDkMtOHc25EgB_sG7p0kzLBuqzJfpSMetBxtNSxOVjh6lyKtYOpqFJzRWkNDfilwXh5n2lCv00GmoVACBHKgpyFqzqZYL31QoiaTkyoczwJr83WTla4QZwzw"
    };
    const key_jwk_pub: JWK_RSA_PRIV = {
        "kty": "RSA",
        "e": "AQAB",
        "use": "sig",
        "kid": "XCVrpFMpHoGj6C7X5L7ZkbbTB0Wa3eb5mmaLuHZWgHw",
        "alg": "RS256",
        "n": "2Pyyc7pmREDv7iQZdZTWsG3n1hJWUOJ_JhcXGsH3lYs4gNyeHbk-ov_bDVqAAKPDQ1Z80oL2wIxGg9gz7h81OxtBxyhZbnw1SkmHz88fCELgpeQGa4C3yXh07ZRqgH_68tWzCpFlIgqybis59jLO0UgiDCtje2PdloJ4pWOMcmHc0rXQBZuSGif3SUe1I12l5K6Y_VEK73jWm3ndp3QO76G2OiVsLSnDkMtOHc25EgB_sG7p0kzLBuqzJfpSMetBxtNSxOVjh6lyKtYOpqFJzRWkNDfilwXh5n2lCv00GmoVACBHKgpyFqzqZYL31QoiaTkyoczwJr83WTla4QZwzw"
    };
    const exp_payload = {
        "sub": "1234567890",
        "name": "John Doe",
        "iat": 1665613690
    };
    const exp_header = {
        "typ": "JWT",
        "alg": "RS256",
        "kid": "XCVrpFMpHoGj6C7X5L7ZkbbTB0Wa3eb5mmaLuHZWgHw"
    };
    const jwt_ = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlhDVnJwRk1wSG9HajZDN1g1TDdaa2JiVEIwV2EzZWI1bW1hTHVIWldnSHcifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjY1NjEzNjkwfQ.Nb-dQIKZrO1wpPiHsilcKhjId1R-MkmYEoKKV0y-BtDssFvA2OQWc-TCDhAIW0WuSGo9Rx8ocVtDJ0lJeaaHeBPpRWaVIqztWR7lUkEb4IS2BCqK4i_zjGGSyD3C_TniZy3FUVYnhabo_smP7ze10PX1PJysmof5Vlm9Ykxc15YWkHA8emxcMnYGJcFwJYoNYU4xm6q4rdDcLObZTPJgeSnXRuaTF7OayK2tDcmqediXRJQzflkS4l1Qg4ta6Tt3vuRbu_yApo9x6R5XpdJ00RTr9heqvEXVty4vxYVqRE6OJ3UqEa_CxhL_JcrfN2Ux0GQK3DSRl3zNnLglkT-BLw";

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
    });

    test('with JWK keys', async () => {
        mockRequest = {
            headers: {
                'authorization': 'Bearer '+jwt_
            }
        }

        const fn = jest.fn();
        mockResponse = {
            json: fn
        };

        const jwtMiddleware = expressjwt({
            secret: jwkToPem(key_jwk_pub),
            //getToken: 
            algorithms: ["RS256"],
        });

        await jwtMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);


        expect(mockRequest.auth).toEqual(exp_payload);
        //expect(nextFunction).toBeCalledTimes(1);
    });
});
