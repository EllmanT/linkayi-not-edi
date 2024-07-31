var express = require("express");
 const axios = require("axios");
// const sendMail = require("../utils/sendMail");

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login/:supplierTIN', async function(req, res, next) {
  console.log("tapinda")
  const {supplierTIN} = req.params;
  console.log("this is the supplier TIN",supplierTIN)
  try {
    const clientDetails = await axios.get(`${process.env.API_URL}GetSupplierByTIN?supplierTIN=${supplierTIN}`, {
        timeout: 10000 // 5 seconds timeout
      });        
    console.log(clientDetails.data); // Access the response data


    res.status(200).json({
      message: "success",
      token: clientDetails.data.supplierTIN
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "error",
      error: error.message
    });
  }
});

module.exports = router;
