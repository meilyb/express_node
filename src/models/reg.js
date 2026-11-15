class RegModel {
    static findByLogin(users, login) {
      return users.find(user => user.login === login);
    }
  
    static create(users, newUser) {
      const userWithId = {
        id: users.length + 1,
        ...newUser
      };
      users.push(userWithId);
      return userWithId;
    }
  }
  
  module.exports = RegModel;
  