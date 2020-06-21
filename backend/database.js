// Database operations take place here

module.exports = {

    /**
     * For testing purposes
     * 
     * @returns true
     */
    test_true: function () {
        return true;
    },





    /**
     * for testing purposes
     * 
     * @returns false
     */
    test_false: function () {
        return false;
    },




    /**
     * Checks database for active users to determine if user is active
     * 
     * @param {string} userid SpotifyID of target
     * @returns {boolean} true if active, false otherwise
     */
    user_is_active: function (userid) {
        // check database active users
        // if contains userid, return true
        // else return false
        return true;
    },





    /**
     * gets sessionid of active user
     * 
     * @param {string} userid User ID of target user
     * @returns sessionid of active user
     */
    get_sessionid: function (userid) {
        // get session id of active user
        return "sessionid";
    }

};