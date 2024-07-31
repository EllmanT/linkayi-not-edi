var express = require("express");
 const axios = require("axios");
// const sendMail = require("../utils/sendMail");

var router = express.Router();

router.get("/GetReceiptsBySupplierTIN", async function (req, res) {
    try {
      const clientTIN = req.query.clientTIN; // Extract the clientTIN from the request query parameters
       // Make the external API call using the extracted clientTIN
       const GetReceiptsBySupplierTIN = await axios.get(`${process.env.API_URL}GetReceiptsByBuyerTIN?buyerTIN=${clientTIN}`, {
        timeout: 10000 // 10 seconds timeout
      });
    
        res.status(200).json({
          message: "success",
          data: GetReceiptsBySupplierTIN.data
        });
      } catch (error) {

        res.status(200).json({
          message: "success",
          data: [{}]
        });
    
        // console.error("Error:", error);
        // res.status(500).json({
        //   message: "error",
        //   error: error.message
        // });
      }
});
router.get("/GetReceiptsByBuyerTIN", async function (req, res) {
  try {

    const clientTIN = req.query.clientTIN; // Extract the clientTIN from the request query parameters
    console.log("THis is the clientTIN", clientTIN);
     // Make the external API call using the extracted clientTIN
     const GetReceiptsByBuyerTIN = await axios.get(`${process.env.API_URL}GetReceiptsBySupplierTIN?supplierTIN=${clientTIN}`, {
      timeout: 10000 // 10 seconds timeout
    });
  
      res.status(200).json({
        message: "success",
        data: GetReceiptsByBuyerTIN.data
      });
    } catch (error) {

     
        res.status(200).json({
          message: "success",
          data: [{}]
        });
    
    
    }
});
router.get("/GetPendingReceiptsBySupplierTIN", async function (req, res) {
  try {
    const clientTIN = req.query.clientTIN; // Extract the clientTIN from the request query parameters
     // Make the external API call using the extracted clientTIN
     const GetPendingReceiptsBySupplierTIN = await axios.get(`${process.env.API_URL}GetPendingReceiptsBySupplierTIN?supplierTIN=${clientTIN}`, {
      timeout: 10000 // 10 seconds timeout
    });
  
      res.status(200).json({
        message: "success",
        data: GetPendingReceiptsBySupplierTIN.data
      });
    } catch (error) {

      res.status(200).json({
        message: "success",
        data: [{}]
      });
  
      // console.error("Error:", error);
      // res.status(500).json({
      //   message: "error",
      //   error: error.message
      // });
    }
});

router.get("/GetSupplierByTIN", async function (req, res) {
  try {
    const clientTIN = req.query.clientTIN; // Extract the clientTIN from the request query parameters
     // Make the external API call using the extracted clientTIN
     let GetClientBySupplierTIN = [];
    GetClientBySupplierTIN = await axios.get(`${process.env.API_URL}GetSupplierByTIN?supplierTIN=${clientTIN}`, {
      timeout: 10000 // 10 seconds timeout
    });
  console.log("client Tin",clientTIN);
      res.status(200).json({
        message: "success",
        data: [GetClientBySupplierTIN.data]
      });
    } catch (error) {

      res.status(500).json({
        message: "false",
        error: error.message
      });
  
      // console.error("Error:", error);
      // res.status(500).json({
      //   message: "error",
      //   error: error.message
      // });
    }
});


module.exports = router;
