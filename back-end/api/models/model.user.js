class UserModel
{
	constructor(first_name, last_name, email, title, roles)
	{
		this.first_name = first_name;
		this.last_name = last_name;
		this.email = email; //from active directory primary key?
		this.title = title;
        this.roles = roles;
	}
}

module.exports = UserModel;

