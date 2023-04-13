const ldap = require("ldapjs");

const authet = () => {
  const client = ldap.createClient({
    url: ["ldap://127.0.0.1:389", "ldap://127.0.0.2:389"],
  });
  client.bind("uid=test,dc=ramhlocal,dc=com", "secret", (err) => {
    if (err) {
      console.log("error in connection", err);
    } else {
      console.log("you are  in !!!!");
    }
  });
};

authet();
