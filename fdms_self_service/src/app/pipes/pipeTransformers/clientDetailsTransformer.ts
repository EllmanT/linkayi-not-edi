

import { clientBuyerInvoice } from "src/app/models/clientBuyerInvoice";
import { formatDate } from "../../utils/utilityFunctions";
import { clientDetail } from "src/app/models/clientDetail";



export const clientDetailsTransformer = (item: any) => {
  let clientDetails: clientDetail[] = []

  clientDetails = item.data.map((item: any) => ({
 
    // supplierRegisterName: item.supplierRegisterName,
    // supplierTIN: item.supplierTIN,
    // supplierBankingDetails: item.supplierBankingDetails,
    // supplierBankingDetailsID: item.supplierBankingDetailsID,
    // supplierAddress: item.supplierAddress
    accountNumber: item.supplierBankingDetails.accountNumber,
    accountName: item.supplierBankingDetails.accountName,
    bankName: item.supplierBankingDetails.bankName,
    branchName: item.supplierBankingDetails.branch,
    currency: item.supplierBankingDetails.currency,

  }));

  return clientDetails;
};



