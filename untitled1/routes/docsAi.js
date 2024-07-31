var express = require("express");
const { writeFileSync } = require("fs");
const { google } = require("googleapis");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const os = require("os");
var router = express.Router();
const credentials = require("./credentials.json");


/* GET users listing. */
router.post("/", async function (req, res) {
    let invoiceStructuredData = {};
    const data = req.body;
    /**
     * TODO(developer): Uncomment these variables before running the sample.
     */
    const projectId = "856756161616";
    const location = "us"; // Format is 'us' or 'eu'
    // const processorId = '3440091e76883ed4' //'825299c583757a10'; // Create processor in Cloud Console
    const processorId = "2ee9ce80923d64f9"; //'825299c583757a10'; // Create processor in Cloud Console
    // const processorId = '2ee9ce80923d64f9'; // Create processor in Cloud Console

    // const filePath = '/path/to/local/pdf';

    const { DocumentProcessorServiceClient } =
        require("@google-cloud/documentai").v1;

    // Instantiates a client
    // apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
    const client = new DocumentProcessorServiceClient({
        apiEndpoint: "us-documentai.googleapis.com",
    });
    //     const client = new DocumentProcessorServiceClient();

    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = data.doc;
//console.log(encodedImage)
    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: "application/pdf",
        },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const { document } = result;

    // Get all of the document text as one big string
    const { text } = document;

    console.log("start of the text")
    console.log(text)
    console.log("end of the text")

    // Extract shards from the text field
    const getText = (textAnchor) => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return "";
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;
        //console.log(textAnchor.textSegments)

        return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    console.log("The document contains the following paragraphs:");
    const [page1] = document.pages;
    const { lines } = page1;

    console.log("lines start here")
    console.log(lines)
    console.log("end of the lines")
    for (const paragraph of lines) {
        const paragraphText = getText(paragraph.layout.textAnchor);
        // const paragraphlines = getText(paragraph)


        console.log(`line text:\n${paragraphText}`);
    }

    //grouping the info base on the number of the textanchor
    for (const newlines of lines) {
        const newParagraphText = getText(newlines.layout.textAnchor);
        const paragraphlines = getText(newParagraphText)
        console.log(paragraphlines)
        console.log("start of the line text")
        console.log(`line text:\n${newParagraphText}`);
        console.log("end of the line text")
    }

    //end of grouping the line items that have the same text anchor

    let entities = result.document.entities[0].properties;

    let filteredEntity = {};

    for (const entity of entities) {
        // let obj = {[entity.type] : entity.mentionText}
        // filteredEntity.push(obj)
        filteredEntity[entity.type] = entity.mentionText;
    }



    // Accessing the structured text from the document
    const tableData = result.document.pages[0].tables;
    let tables = [];


//extracting the data from the table

    for (let i = 0; i < tableData.length; i++) {
        // Extracting data from the table
        const extractedData = [];

        const headers = [];

        for (const header of tableData[i].headerRows) {
            for (const cell of header.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace("\n", ""); //cell.layout.textAnchor.textSegments[0].content;
                headers.push(cellText);
            }
        }

        for (const row of tableData[i].bodyRows) {
            const rowData = {};

            let num = 0;
            for (const cell of row.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace("\n", ""); //cell.layout.textAnchor.textSegments[0].content;
                let obj = { [headers[num]]: cellText };

                rowData[headers[num]] = cellText;
                num++;
            }

            extractedData.push(rowData);
        }
        tables.push(extractedData);
    }

    let formFields = {};

    for (const field of result.document.pages[0].formFields) {
        formFields[getText(field.fieldName.textAnchor).replace("\n", "")] = getText(
            field.fieldValue.textAnchor
        ).replace("\n", "");
    }

    // entities = {};
    // for (const entity of result.document.entities[0].properties){
    //     entities[getText(entity.type).replace('\n', '')] = getText(entity.mentionText).replace('\n', '');
    // }

    invoiceStructuredData.tables = tables;
    invoiceStructuredData.formFields = formFields;
    invoiceStructuredData.ocr = result.document.text;
    invoiceStructuredData.entities = filteredEntity;

    const invoiceText = result.document.text;
    res.send(result);

});

/** Form parser  start*/
router.post("/form-parser", async function (req, res) {
    let invoiceStructuredData = {};
    const data = req.body;
//console.log("data starts" ,data)
    /**
     * TODO(developer): Uncomment these variables before running the sample.
     */
    const projectId = "856756161616";
    const location = "us"; // Format is 'us' or 'eu'
    // const processorId = '3440091e76883ed4' //'825299c583757a10'; // Create processor in Cloud Console
    const processorId = "825299c583757a10"//"2ee9ce80923d64f9"; //'825299c583757a10'; // Create processor in Cloud Console
    // const processorId = '2ee9ce80923d64f9'; // Create processor in Cloud Console

    // const filePath = '/path/to/local/pdf';

    const { DocumentProcessorServiceClient } =
        require("@google-cloud/documentai").v1;

    // Instantiates a client
    // apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
    const client = new DocumentProcessorServiceClient({
        apiEndpoint: "us-documentai.googleapis.com",
    });
    //     const client = new DocumentProcessorServiceClient();

    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

    // Read the file into memory.
    // const fs = require('fs').promises;
    // const imageFile = await fs.readFile(filePath);

    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = data.doc;
//console.log(encodedImage)
    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: "application/pdf",
        },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const { document } = result;

    // Get all of the document text as one big string
    const { text } = document;



    // Extract shards from the text field
    const getText = (textAnchor) => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return "";
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;
        //console.log(textAnchor.textSegments)

        return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    console.log("The document contains the following paragraphs:");
    const [page1] = document.pages;
    const { lines } = page1;


    for (const paragraph of lines) {
        const paragraphText = getText(paragraph.layout.textAnchor);
        // const paragraphlines = getText(paragraph)
        //console.log(paragraphlines)

        console.log("start of paragraph")
        console.log(paragraph.layout.textAnchor)
        console.log("end of the paragraph ")

        console.log(`line text:\n${paragraphText}`);
    }

    //grouping the info base on the number of the textanchor
    for (const newlines of lines) {
        const newParagraphText = getText(newlines.layout.textAnchor);
        const paragraphlines = getText(newParagraphText)
        console.log(paragraphlines)
        console.log("start of the line text")
        console.log(`line text:\n${newParagraphText}`);
        console.log("end of the line text")
    }

    //end of grouping the line items that have the same text anchor

    let entities = result.document.entities[0].properties;

    let filteredEntity = {};

    for (const entity of entities) {
        // let obj = {[entity.type] : entity.mentionText}
        // filteredEntity.push(obj)
        filteredEntity[entity.type] = entity.mentionText;
    }



    // Accessing the structured text from the document
    const tableData = result.document.pages[0].tables;
    let tables = [];

    //console.log("start of the table data")
    //console.log(tableData)
    //console.log("end of the table data")
    console.log("start of the table data")
    console.log(result.document.pages[0])
    console.log("end of the table data")

    console.log("start of the table")
    console.log(tableData)
    console.log("end of the tabledata actual")


//extracting the data from the table

    for (let i = 0; i < tableData.length; i++) {
        // Extracting data from the table
        const extractedData = [];

        const headers = [];

        for (const header of tableData[i].headerRows) {
            for (const cell of header.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace("\n", ""); //cell.layout.textAnchor.textSegments[0].content;
                headers.push(cellText);
            }
        }

        for (const row of tableData[i].bodyRows) {
            const rowData = {};

            let num = 0;
            for (const cell of row.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace("\n", ""); //cell.layout.textAnchor.textSegments[0].content;
                let obj = { [headers[num]]: cellText };

                rowData[headers[num]] = cellText;
                num++;
            }

            extractedData.push(rowData);
        }
        tables.push(extractedData);
    }

    let formFields = {};

    for (const field of result.document.pages[0].formFields) {
        formFields[getText(field.fieldName.textAnchor).replace("\n", "")] = getText(
            field.fieldValue.textAnchor
        ).replace("\n", "");
    }

    // entities = {};
    // for (const entity of result.document.entities[0].properties){
    //     entities[getText(entity.type).replace('\n', '')] = getText(entity.mentionText).replace('\n', '');
    // }

    invoiceStructuredData.tables = tables;
    invoiceStructuredData.formFields = formFields;
    invoiceStructuredData.ocr = result.document.text;
    invoiceStructuredData.entities = filteredEntity;

    const invoiceText = result.document.text;
    //res.send(result);
    //console.log("result",result);
    console.log("start of tablees taht I want");
    console.log(invoiceStructuredData.tables);
    console.log("end of the tables that i want");
    res.send(tables)


});
/**End of the form parser */

router.post("/generate-text-file", (req, res) => {
    // OAuth2 credentials

    let data = req.body;

    console.log("request data: ", data);
    //let update={};

    let invnumberpos = "";
    let invnumberposcreditnote = "";
    let discountinvoice = "";
    let discountcredit = "";
    let end2invoice = "";
    let end2credit = "";
    let invoicenumber = "";

    // Extracting values
    const totalAmount =
        data?.invoice?.TOTALAMOUNT || data?.creditNote?.TOTALAMOUNT;
    const taxAmount = data?.invoice?.TAXAMOUNT;
    const amount = data?.invoice?.START1;
    invoicenumber = data?.invoice?.INVOICENUMBER;

    //latest conditional check start
    const refnumber = data?.invoice?.ORIGINALINVOICENUMBER;

    if (invoicenumber === undefined && refnumber !== undefined) {
        invoicenumber = refnumber;
    }

    //end of latest conditional check
    invnumberpos = data?.invoice?.INVOICENUMBERPOS;
    if (invnumberpos === undefined) {
        invnumberpos = "";
    }
    invnumberposcreditnote = data?.creditNote?.INVOICENUMBERPOS;
    if (invnumberposcreditnote === undefined) {
        invnumberposcreditnote = "";
    }
    discountinvoice = data?.invoice?.DISCOUNT;
    discountcredit = data?.creditNote?.DISCOUNT;

    end2invoice = data?.invoice?.END2;
    end2credit = data?.creditNote?.END2;

    if (discountinvoice === undefined) {
        discountinvoice = "";
    }

    if (discountcredit === undefined) {
        discountcredit = "";
    }
    if (end2invoice === undefined) {
        end2invoice = "";
    }
    if (end2credit === undefined) {
        end2credit = "";
    }
    const nameofissueditem = data?.invoice?.NAMEOFISSUEDITEM;
    const ruleidentifier = data?.invoice?.RULEIDENTIFIER;

    if (ruleidentifier.indexOf("invoice") !== -1) {
        if (
            typeof invoicenumber !== "string" ||
            (invoicenumber.indexOf("doc") === -1 &&
                invoicenumber.indexOf("ref") === -1)
        ) {
            invoicenumber = "";
        } else if (
            typeof refnumber === "string" &&
            (refnumver.indexOf("doc") !== -1 || refnumber.indexOf("ref") !== -1)
        ) {
            invoicenumber = refnumber;
        }
    }
    const start1 = data?.invoice?.START1;
    const start2 = data?.invoice?.START2;
    const end1 = data?.invoice?.END1;
    const taxamountstart = data?.invoice?.TAXAMOUNTSTART;
    const unitprice = data?.invoice?.UNITPRICE;
    const quantity = data?.invoice?.QUANTITY;
    const referencenumber = data?.creditNote?.ORIGINALINVOICENUMBER;

    //     const systemDrive = path.parse(os.homedir()).root; // Retrieve the root drive of the operating system
    //     const folderName = 'revmax_templates';
    //     const folderPath = path.join(systemDrive, folderName);
    //
    //
    //     const destinationFolderPath = path.join(systemDrive, "revmax"); // Specify the destination folder path
    //     const destinationFilePath = path.join(destinationFolderPath, "Settings.ini");
    // // Check if the destination file exists
    //     if (!fs.existsSync(destinationFilePath)) {
    //         // Create an empty settings.ini file
    //         fs.writeFileSync(destinationFilePath, '');
    //     }
    //
    // // Create the folder if it does not exist
    //     if (!fs.existsSync(folderPath)) {
    //         fs.mkdirSync(folderPath, { recursive: true });
    //     }
    //
    //     const filePath = path.join(folderPath, "Settings.ini");
    //     // Settings data for invoice
    //
    //     // Check if the destination file exists
    //     if (!fs.existsSync(filePath)) {
    //         // Create an empty settings.ini file
    //         fs.writeFileSync(filePath, '');
    //     }

    const settings = `
[SETTINGS]
CURRENTRULE=1
SAVED=1
SBOXMODE=0
SBOXPOS=Send To OneNote 16
OPOS=0
SBOXFILENAME=C:\\Revmax\\sboxsignature.txt
BATCHRESULTFILE=RESULT
BATCHFOLDER=C:\\Users\\Kriish\\Documents\\
BATCHACTIVATE=0
MultiInvoice=1
PRINTER1=Microsoft Print to PDF
DOLLAR=ZIG|ZiG|ZIG$|ZiG$|zig|Zig|ziG|ZG$|$|R|USD|T|ZAR|ZWL|ZW|RTGS|INR|USD$|ZWL$ |US|D|ZW|L|2wL|2w|US|ZW|L|D|US$|,
[1]
MultiInvoice=1
QRFONTSIZE=160
AMOUNTEND=LAST
ISLESSENABLED=0
MAKEONEPAGE=1
HOWMANYPAGES=5
IGNOREHyphen=1
LESSENTRYCHECK_LESS_THAN=
ExclusionLISTWORDS=
CURRENCIEFINDERKEYWORD=${totalAmount}
CURRENCIES=ZIG|ZiG|ZIG$|ZiG$|zig|Zig|ziG|ZG$|ZWL|USD|$|ZWL$|ZWD|US$|Z$|(USD)|$USD|(ZWL)|U$|US|ZW$|ADP|AED|AFA|AFN|ALL|AMD|ANG|AOA|AON|AOR|ARS|ATS|AUD|AWG|AZM|BAM|BBD|BDT|BEF|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BYB|BYR|BZD|CAD|CDF|CFP|CHF|CLP|CLP4|CNY|COP|CRC|CSD|CUP|CVE|CYP|CZK|DEM|DEM3|DJF|DKK|DOP|DZD|ECS|EEK|EGP|ERN|ESP|ETB|EUR|EUR4|FIM|FJD|FKP|FRF|GBP|GEL|GHC|GIP|GMD|GNF|GRD|GTQ|GWP|GYD|HKD|HNL|HRK|HTG|HUF|IDR|IEP|ILS|INR|IQD|IRR|ISK|ITL|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LTL|LUF|LVL|LYD|MAD|MDL|MGA|MGF|MKD|MMK|MNT|MOP|MRO|MTL|MUR|MVR|MWK|MXN|MYR|MZM|NAD|NGN|NIO|NLG|NOK|NPR|NZD|NZD5|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PTE|PYG|QAR|RMB|ROL|RTB|RTGS|RUB|RWF|SAR|SBD|SCR|SDD|SDP|SEK|SGD|SHP|SIT|SKK|SLL|SOS|SRD|SRG|STD|SVC|SYP|SZL|THB|TJR|TJS|TMM|TND|TOP|TPE|TRL|TRY|TTD|TWD|TZS|UAH|UF|UGX|USD|UTM|UYU|UZS|VEB|VEF|VND|VUV|WST|XAF|XCD|XDS|XEU|XOF|XPF|YER|YUM|ZAR|ZMK|ZRN|RTGS|USD|Z
ZWDINVOICE=${totalAmount}
ZWLINVOICE=${totalAmount}
USDINVOICE=${totalAmount}
ZIGINVOICE=${totalAmount}
ZiGINVOICE=${totalAmount}
AMOUNTPAIDUSD=${totalAmount} ## USD
AMOUNTPAIDZIG=${totalAmount} ## ZIG
AMOUNTPAIDZiG=${totalAmount} ## ZiG
AMOUNTPAIDZWL=${totalAmount} ## ZWL
RULEIDENTIFIER=${data?.invoice?.RULEIDENTIFIER}
TAXPAYERBPN=  
TAXPAYERCODE= 
INVOICETYPECODE=
INVOICECODE= 
INVOICENUMBER=${invoicenumber}   
INVOICENUMBERPOS=${invnumberpos}       
TAXPAYERNAME=
VATCODE= 
OPERATIONADDRESS=
TAXPAYERTELEPHONE=
SHORTNAMEFORUSAGEADDRESS=
PAYERSNAME=
PAYERSVATNUMBER=
PAYERSADDRESS=
PAYERSTELEPHONENUMBER=
PAYERCODE=
TOTALAMOUNT=${totalAmount}
TOTALAMOUNTSTART=${taxAmount}
TAXAMOUNT=${taxAmount}
TAXAMOUNTSTART=${end1}
INVOICESTATUSCODE=
ISSUERNAME=
ISSUINGDATE=
TAXCONTROLCODE=
ORIGINALINVOICECODE=
REMARK=
LINE=
CODEOFISSUESITEM=
NAMEOFISSUEDITEM=${nameofissueditem}
NAMEOFISSUEDITEM2=
QUANTITY=${quantity}
UNITPRICE=${unitprice}
AMOUNT=${amount}
DISCOUNT=${discountinvoice}
TAX=
EXCEPT=ZIG0.00|ZiG0.00|0.00|EX|EXE|exe|Ex|Non|NON|except|EXCEPT|USD0.00|0.00%|0%
TAXRATE=15%
START1=${start1}
START2=
START3=
END1=${end1}
END2=${end2invoice}
END3=
FILL_PAYERSNAME=
FILL_TAXPAYERBPN=
FILL_TAXPAYERCODE=
FILL_TAXPAYERTELEPHONE=
FILLOPERATIONADDRESS=
ZIMRALINK=https://fdmstest.zimra.co.zw/
ACTIVE=1
FIRSTPAGESIGN=0
FACENAME=Arial
FONTSIZE=16
FONTWEIGHT=700
FONTBOLD=1
DEBITNOTEIDENTIFIER=
CREDITNOTEIDENTIFIER=
FONTITALIC=0
FONTSTRICKOUT=0
FONTUNDERLINE=0
FONTCOLOR=0
POSITION=5  
    `;

    //data for the credit note
    const creditNote = `
[2]
QRFONTSIZE=160
AMOUNTEND=LAST
ISLESSENABLED=0
HOWMANYPAGES=5
MAKEONEPAGE=1
LESSENTRYCHECK_LESS_THAN=
ExclusionLISTWORDS=
IGNOREHyphen=1
CURRENCIEFINDERKEYWORD=${data?.creditNote?.TOTALAMOUNT}
CURRENCIES=ZIG|ZiG|ZIG$|ZiG$|zig|Zig|ziG|ZG$|ZWL|USD|$|ZWL$|ZWD|US$|Z$|(USD)|$USD|(ZWL)|U$|US|ZW$|ADP|AED|AFA|AFN|ALL|AMD|ANG|AOA|AON|AOR|ARS|ATS|AUD|AWG|AZM|BAM|BBD|BDT|BEF|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BYB|BYR|BZD|CAD|CDF|CFP|CHF|CLP|CLP4|CNY|COP|CRC|CSD|CUP|CVE|CYP|CZK|DEM|DEM3|DJF|DKK|DOP|DZD|ECS|EEK|EGP|ERN|ESP|ETB|EUR|EUR4|FIM|FJD|FKP|FRF|GBP|GEL|GHC|GIP|GMD|GNF|GRD|GTQ|GWP|GYD|HKD|HNL|HRK|HTG|HUF|IDR|IEP|ILS|INR|IQD|IRR|ISK|ITL|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LTL|LUF|LVL|LYD|MAD|MDL|MGA|MGF|MKD|MMK|MNT|MOP|MRO|MTL|MUR|MVR|MWK|MXN|MYR|MZM|NAD|NGN|NIO|NLG|NOK|NPR|NZD|NZD5|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PTE|PYG|QAR|RMB|ROL|RTB|RTGS|RUB|RWF|SAR|SBD|SCR|SDD|SDP|SEK|SGD|SHP|SIT|SKK|SLL|SOS|SRD|SRG|STD|SVC|SYP|SZL|THB|TJR|TJS|TMM|TND|TOP|TPE|TRL|TRY|TTD|TWD|TZS|UAH|UF|UGX|USD|UTM|UYU|UZS|VEB|VEF|VND|VUV|WST|XAF|XCD|XDS|XEU|XOF|XPF|YER|YUM|ZAR|ZMK|ZRN|RTGS|USD|Z| 
ZWDINVOICE=${data?.creditNote?.TOTALAMOUNT}
ZWLINVOICE=${data?.creditNote?.TOTALAMOUNT}
USDINVOICE=${data?.creditNote?.TOTALAMOUNT}
ZIGINVOICE=${data?.creditNote?.TOTALAMOUNT}
ZiGINVOICE=${data?.creditNote?.TOTALAMOUNT}
AMOUNTPAIDUSD=${data?.creditNote?.TOTALAMOUNT} ## USD
AMOUNTPAIDZIG=${data?.creditNote?.TOTALAMOUNT} ## ZIG
AMOUNTPAIDZiG=${data?.creditNote?.TOTALAMOUNT} ## ZiG
AMOUNTPAIDZWL=${data?.creditNote?.TOTALAMOUNT} ## ZWL
RULEIDENTIFIER=${data?.creditNote?.RULEIDENTIFIER}
TAXPAYERBPN=  
TAXPAYERCODE= 
INVOICETYPECODE=
INVOICECODE= 
INVOICENUMBER=${data?.creditNote?.INVOICENUMBER}    
INVOICENUMBERPOS=${invnumberposcreditnote}
TAXPAYERNAME=
VATCODE= 
OPERATIONADDRESS=
TAXPAYERTELEPHONE=
SHORTNAMEFORUSAGEADDRESS=
PAYERSNAME=
PAYERSVATNUMBER=
PAYERSADDRESS=
PAYERSTELEPHONENUMBER=
PAYERCODE=
TOTALAMOUNT=${data?.creditNote?.TOTALAMOUNT}
TOTALAMOUNTSTART=${data?.creditNote?.TAXAMOUNT}
TAXAMOUNT=${data?.creditNote?.TAXAMOUNT}
TAXAMOUNTSTART=${data?.creditNote?.END1}
INVOICESTATUSCODE=
ISSUERNAME=
ISSUINGDATE=
TAXCONTROLCODE=
ORIGINALINVOICECODE= 
ORIGINALINVOICENUMBER=${referencenumber}
REMARK=
LINE=
CODEOFISSUESITEM=
NAMEOFISSUEDITEM=${data?.creditNote?.NAMEOFISSUEDITEM}
NAMEOFISSUEDITEM2=
QUANTITY=${data?.creditNote?.QUANTITY}
UNITPRICE=${data?.creditNote?.UNITPRICE}
AMOUNT=${data?.creditNote?.START1}
DISCOUNT=${discountcredit}
TAX=
EXCEPT=ZIG0.00|ZiG0.00|0.00|EX|EXE|exe|Ex|Non|NON|except|EXCEPT|USD0.00|0.00%|0%
TAXRATE=15%
START1=${data?.creditNote?.START1}
START2=
START3=
END1=${data?.creditNote?.END1}
END2=${end2credit}
END3=
FILL_PAYERSNAME=
FILL_TAXPAYERBPN=
FILL_TAXPAYERCODE=
FILL_TAXPAYERTELEPHONE=
FILLOPERATIONADDRESS=
ZIMRALINK=https://fdmstest.zimra.co.zw/
ACTIVE=1
FIRSTPAGESIGN=0
FACENAME=Arial
FONTSIZE=16
FONTWEIGHT=700
FONTBOLD=1
DEBITNOTEIDENTIFIER=
CREDITNOTEIDENTIFIER=02
FONTITALIC=0
FONTSTRICKOUT=0
FONTUNDERLINE=0
FONTCOLOR=0
POSITION=5
LARGEDOLLAR=0     
`;

    const concatData = settings + "\n " + creditNote;
    writeFileSync("Settings.ini", concatData);
    res.download("Settings.ini");

    //counting the number of downloads

    // Asynchronous function to write data to a Google Sheet.
    async function writeToSheet(auth, values) {
        const sheets = google.sheets({ version: "v4", auth }); // Creates a Sheets API client instance.
        const spreadsheetId = "1LlFhvpcEjmgDWHaafKYSWpdKKa5fv8vQemiKLE-b_UM"; // The ID of the spreadsheet.
        const range = "Sheet1!A2:D2"; // The range in the sheet where data will be written.
        const valueInputOption = "USER_ENTERED"; // How input data should be interpreted.

        const resource = { values }; // The data to be written.

        try {
            const res = await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption,
                resource,
            });
            return res.data; // Returns the response data from the Sheets API.
        } catch (error) {
            console.error("Error writing to sheet:", error);
            throw error;
        }
    }

    // Asynchronous function to read data from a Google Sheet.
    async function readSheet(auth) {
        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = "1LlFhvpcEjmgDWHaafKYSWpdKKa5fv8vQemiKLE-b_UM";
        const range = "Sheet1!A2:D2"; // Specifies the range to read.

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });
            const rows = response.data.values || []; // Extracts the rows from the response.
            return rows; // Returns the rows.
        } catch (error) {
            console.error("Error reading sheet:", error);
            throw error;
        }
    }

    (async () => {
        try {
            // Initializes the Google APIs client library and sets up the authentication using service account credentials.
            const auth = new google.auth.GoogleAuth({
                keyFile: "./credentials.json", // Path to your service account key file.
                scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scope for Google Sheets API.
            });

            // Fetch public IP address
            const response = await axios.get("https://api.ipify.org?format=json");
            const ipAddress = response.data.ip;

            // Write data with IP address and increment count
            let data = await readSheet(auth);

            // Find the existing count for the IP address
            let count = 0;
            for (const row of data) {
                if (row[0] === ipAddress) {
                    count = parseInt(row[1]);
                    break;
                }
            }

            // Increment the count for the IP address
            count++;

            // Update the sheet with the new count
            await writeToSheet(auth, [[ipAddress, count]]);

            // Read the updated data from the sheet
            data = await readSheet(auth);
            console.log(data); // Logs the updated data
        } catch (error) {
            console.error("Error:", error);
        }
    })();

    return;
    // Read the existing content of the settings.ini file
    //     fs.readFile(filePath, "utf8", (err, existingData) => {
    //         if (err) {
    //             console.error("Error reading settings.ini:", err);
    //         } else {
    //             // fs.writeFile('./', settings, (err) => {
    //             //     if (err) {
    //             //         console.error("Error writing settings.ini:", err);
    //             //     } else {
    //             //         console.log("settings.ini file created successfully.");
    //             //         console.log(settings);
    //             //
    //             //         res.download("Settings.ini");
    //             //     }
    //             // });
    //
    //
    //
    //             if (!existingData || existingData.length === 0) {
    //                 //logic for writing into the settings file based on the initial input
    //                 if (ruleidentifier.toLowerCase().includes("invoice")) {
    //                     // Write settings to the settings.ini file
    //                     fs.writeFile(filePath, settings, (err) => {
    //                         if (err) {
    //                             console.error("Error writing settings.ini:", err);
    //                         } else {
    //                             console.log("settings.ini file created successfully.");
    //                             console.log(settings);
    //                         }
    //                     });
    //                 } else {
    //                     // Write creditNote to the settings.ini file if that is what the user has put
    //                     fs.writeFile(filePath, creditNote, (err) => {
    //                         if (err) {
    //                             console.error("Error writing settings.ini:", err);
    //                         } else {
    //                             console.log("credit note.ini file created successfully.");
    //                             console.log(creditNote);
    //                         }
    //                     });
    //                 }
    //             } else {
    //                 // Append new information to the existing content
    //                 if (
    //                     existingData.includes("[1]") &&
    //                     !existingData.includes("ORIGINALINVOICENUMBER")
    //                 ) {
    //                     console.log("Invoice already exists");
    //                 } else {
    //                     if (ruleidentifier.toLowerCase().includes("invoice")) {
    //                         const updatedData = settings + existingData;
    //                         data = updatedData;
    //                         // Write the updated content back to the settings.ini file
    //                         fs.writeFile(filePath, updatedData, (err) => {
    //                             if (err) {
    //                                 console.error("Error writing settings.ini:", err);
    //                             } else {
    //                                 console.log("settings.ini file updated successfully.");
    //                             }
    //                         });
    //                         //console.log(update ,"update here")
    //                         // Reformat the data before writing to the text file
    //                         const formattedData = mapMentionsWithFormatting(updatedData);
    //                         // Write the content to a file
    //                         writeFileSync("Settings.ini", formattedData);
    //
    //
    //                         // Send the file back to the client
    //                         res.download("Settings.ini");
    // // Move the file to the destination folder
    // // Move the file to the destination folder
    //                         rename(filePath, destinationFilePath)
    //                             .then(() => {
    //                                 // File moved successfully, delete the original file
    //                                 return unlink(filePath);
    //                             })
    //                             .then(() => {
    //                                 // File deletion completed
    //                                 // Reload the page
    //                                 // location.reload();
    //                             })
    //                             .catch((error) => {
    //                                 // Handle any errors bug for now bho still
    //                                 //  console.error('Error moving or deleting the file:', error);
    //                             });
    //
    // //fs.unlinkSync(filePath);
    // // Reload the page
    // //location.reload();
    //
    //                     }
    //                 }
    //
    //                 // Check for the presence of the credit note
    //                 if (
    //                     existingData.includes("[2]") &&
    //                     existingData.includes("ORIGINALINVOICENUMBER")
    //                 ) {
    //                     console.log("Credit note already exists");
    //                 } else {
    //                     if (ruleidentifier.toLowerCase().includes("credit")) {
    //                         const updatedData = existingData + creditNote;
    //                         data = updatedData;
    //                         // Write the updated content back to the settings.ini file
    //                         fs.writeFile(filePath, updatedData, (err) => {
    //                             if (err) {
    //                                 console.error("Error writing settings.ini:", err);
    //                             } else {
    //                                 console.log("credit note.ini file updated successfully.");
    //                             }
    //                         });
    //
    //
    //                         //console.log(update ,"update here")
    //                         // Reformat the data before writing to the text file
    //                         //const formattedData = mapMentionsWithFormatting(updatedData);
    //                         // Write the content to a file
    //                         console.log(existingData, "existing data")
    //                         console.log(creditNote,"credit note")
    //                         writeFileSync("Settings.txt", data);
    //
    //                         // Send the file back to the client
    //                         res.download("Settings.ini");
    //
    //                         // Copy the file contents to the destination folder
    //                         fs.copyFile(filePath, destinationFilePath, (error) => {
    //                             if (error) {
    //                                 console.error('Error copying the file:', error);
    //                                 // Handle the error appropriately
    //                             } else {
    //                                 // File copied successfully, proceed with deleting the original file
    //                                 fs.unlink(filePath, (error) => {
    //                                     if (error) {
    //                                         console.error('Error deleting the original file:', error);
    //                                         // Handle the error appropriately
    //                                     } else {
    //                                         // File deletion completed
    //                                         // Reload the page
    //                                         // location.reload();
    //                                     }
    //                                 });
    //                             }
    //                         });
    //
    //
    //
    //
    //
    //                     }
    //                 }
    //             }
    //         }
    //     });

    // Generate the text file content
    const textContent = JSON.stringify(data);
});

// router.post('/generate-text-file', (req, res) => {
//     const data = req.body; // Assuming data is sent in the request body
//
//     console.log(data)
//     // Generate the text file content
//     const textContent = JSON.stringify(data);
//
//     // Reformat the data before writing to the text file
//     const formattedData = mapMentionsWithFormatting(data);
//     // Write the content to a file
//     writeFileSync('settings.ini', formattedData);
//
//     // Send the file back to the client
//     res.download('settings.ini');
// });

function mapMentionsWithFormatting(mentions) {
    let formattedContent = "";
    for (const key in mentions) {
        if (Object.prototype.hasOwnProperty.call(mentions, key)) {
            const value = mentions[key];
            formattedContent += `${key} = ${value}\n`;
        }
    }
    return formattedContent;
}
// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Obtains the id token by providing the target audience using service account credentials.
 *
 * @param {string} jsonCredentialsPath  - Path to the service account json credential file.
 *   and use IAM to narrow the permissions: https://cloud.google.com/docs/authentication#authorization_for_services
 * @param {string} targetAudience - The url or target audience to obtain the ID token for.
 */
function main(
    targetAudience = "us-documentai.googleapis.com",
    jsonCredentialsPath = "./gcp-certification-415402-2f0d63c56edf.json"
) {
    // [START auth_cloud_idtoken_service_account]
    /**
     * TODO(developer):
     *  1. Uncomment and replace these variables before running the sample.
     */
        // const jsonCredentialsPath = '/path/example';
        // const targetAudience = 'http://www.example.com';

        // Using service account keys introduces risk; they are long-lived, and can be used by anyone
        // that obtains the key. Proper rotation and storage reduce this risk but do not eliminate it.
        // For these reasons, you should consider an alternative approach that
        // does not use a service account key. Several alternatives to service account keys
        // are described here:
        // https://cloud.google.com/docs/authentication/external/set-up-adc

    const { GoogleAuth } = require("google-auth-library");
    const fs = require("fs");
    const credentials = JSON.parse(fs.readFileSync(jsonCredentialsPath, "utf8"));

    async function getIdTokenFromServiceAccount() {
        const auth = new GoogleAuth({ credentials });

        // Get an ID token client.
        // The client can be used to make authenticated requests or you can use the
        // provider to fetch an id token.
        const client = await auth.getIdTokenClient(targetAudience);
        await client.idTokenProvider.fetchIdToken(targetAudience);

        console.log("Generated ID token.");
    }

    getIdTokenFromServiceAccount();
    // [END auth_cloud_idtoken_service_account]
}

process.on("unhandledRejection", (err) => {
    console.error(err.message);
    process.exitCode = 1;
});

main(...process.argv.slice(2));
module.exports = router;
