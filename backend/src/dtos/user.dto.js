const {BASE_URL} = require('../../config');

class UserDto {
    _id;
    username;
    fullname;
    email;
    phone;
    avatar;
    gender;
    dob;
    address;
    role;
    verified;
    status;
    createdAt;
    updatedAt;

    constructor(user) {
        this._id = user._id;
        this.username = user.username;
        this.fullname = user.fullname;
        this.email = user.email;
        this.phone = user.phone;
        this.avatar = BASE_URL + user.avatar;
        this.gender = user.gender;
        this.dob = user.dob;
        this.address = user.address;
        this.role = user.role;
        this.verified = user.verified;
        this.status = user.status;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

module.exports = UserDto;