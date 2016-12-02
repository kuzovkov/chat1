var users = {}

function addUser(nicname){
    for(key in users){
        if (key == nicname){
            return false;
        }
    }
    users[nicname] = 0;
    return true;
}



exports.users = users;
