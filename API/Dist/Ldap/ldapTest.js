import LdapAuth from 'ldapauth-fork';
const options = {
    'url': 'ldap://ldap.forumsys.com:389',
    'bindDN': 'cn=read-only-admin,dc=example,dc=com',
    'bindCredentials': 'password',
    'searchBase': 'dc=example,dc=com',
    'searchFilter': 'uid={{username}}'
};
const client = new LdapAuth(options);
const username = 'galieleo';
const password = 'passord';
const message = "wrong password";
export const run = (username, password) => new Promise((resolve, reject) => {
    client.authenticate(username, password, (error, user) => {
        if (error) {
            return reject(error);
        }
        return resolve(user);
    });
});
//# sourceMappingURL=ldapTest.js.map