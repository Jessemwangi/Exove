
import LdapAuth from 'ldapauth-fork'
import { ILdapAuth } from '../dbcontext/Interfaces.js'

// https://www.forumsys.com/tutorials/integration-how-to/ldap/online-ldap-test-server/

const options = {
  'url': 'ldap://ldap.forumsys.com:389',
  'bindDN': 'cn=read-only-admin,dc=example,dc=com',
  'bindCredentials': 'password',
  'searchBase': 'dc=example,dc=com',
  'searchFilter': 'uid={{username}}'
}
// const client = new LdapAuth(options)
const username = 'galieleo'
const password = 'passord'
const message="wrong password"

interface welcomeType {
    cn: string,
    mail: string
    
  }

export const run = (username:string, password:string) : Promise<ILdapAuth> => new Promise((resolve, reject) => {
  // client.authenticate(username, password, (error, user:ILdapAuth) => {
  //   if (error) {
  //     return reject(error)
     
  //   }
    
  //   return resolve(user)
  // })
})

