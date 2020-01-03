const users = {
    name: 'Amuk',
    email: 'amuk.saxena@oncehub.com'
}

function getAllUsers(_req, res) {
    console.log('hello world');
    return res.json({ 
        success: true,
        data: {
            users: {
                name: "Amuk",
                email: "amuk.saxena@oncehub.com"
            }
        }
    });
}

function getUser(req, res){
    const requiredUser = req.params.user;
    const user = users.filter((user) => user.name === requiredUser);
    const exists = user.length > 0;
    return res
            .status(exists ? 200: 404)
            .json({
                success: exists,
                data: exists ? user[0]: 'User not found'
            })
}

module.exports = {
    getAllUsers,
    getUser
}