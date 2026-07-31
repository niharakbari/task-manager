
const getHealth = (req, res) => {

        res.status(200).json({
            "success": true,
             "message" : "API is is running correctly"
        })
          
};

module.exports = {
    getHealth
};