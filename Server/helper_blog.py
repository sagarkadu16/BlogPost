import hashlib
import os
import jwt

def Decode(auth_header):
    token_encoded = auth_header.split(' ')[1]
    decode_id = jwt.decode(token_encoded, 'masai', algorithms=['HS256'])
    return decode_id