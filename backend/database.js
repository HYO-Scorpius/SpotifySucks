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
     * gets sessionid of active user
     * 
     * @param userid User ID of target user
     * @returns sessionid of active user
     */
    get_sessionid: function (userid) {
        // get session id of active user
        return "sessionid";
    }

};