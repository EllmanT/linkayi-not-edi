/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const docsAi = onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    await main(...process.argv.slice(2));

    let invoiceStructuredData: any = {}
    const data = req.body
    // console.log(req.body)
    /**
     * TODO(developer): Uncomment these variables before running the sample.
     */
    const projectId = '856756161616';
    const location = 'us'; // Format is 'us' or 'eu'
    const processorId = '825299c583757a10'; // Create processor in Cloud Console
// const filePath = '/path/to/local/pdf';

    const {DocumentProcessorServiceClient} =
        require('@google-cloud/documentai').v1;

// Instantiates a client
// apiEndpoint regions available: eu-documentai.googleapis.com, us-documentai.googleapis.com (Required if using eu based processor)
    const client = new DocumentProcessorServiceClient({apiEndpoint: 'us-documentai.googleapis.com'});
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

    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: 'application/pdf',
        },
    };

    // Recognizes text entities in the PDF document
    const [result] = await client.processDocument(request);
    const {document} = result;

    // Get all of the document text as one big string
    const {text} = document;

    // Extract shards from the text field
    const getText = (textAnchor: any) => {
        if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
            return '';
        }

        // First shard in document doesn't have startIndex property
        const startIndex = textAnchor.textSegments[0].startIndex || 0;
        const endIndex = textAnchor.textSegments[0].endIndex;

        return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    console.log('The document contains the following paragraphs:');
    const [page1] = document.pages;
    const {lines} = page1;

    for (const paragraph of lines) {
        const paragraphText = getText(paragraph.layout.textAnchor);
        console.log(`line text:\n${paragraphText}`);
    }

    let entities = result.document.entities[0].properties

    let filteredEntity = []

    for (const entity of entities) {
        let obj = {[entity.type]: entity.mentionText}
        filteredEntity.push(obj)
    }

    // Accessing the structured text from the document
    const tableData = result.document.pages[0].tables;
    let tables = []

    for (let i = 0; i < tableData.length; i++) {
        // Extracting data from the table
        const extractedData = [];

        const headers: any[] = []

        for (const header of tableData[i].headerRows) {
            for (const cell of header.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace('\n', '') //cell.layout.textAnchor.textSegments[0].content;
                headers.push(cellText);
            }
        }

        for (const row of tableData[i].bodyRows) {
            const rowData: any = {};

            let num: number = 0;
            for (const cell of row.cells) {
                // Assuming each cell has a text field, adapt based on your document structure
                const cellText = getText(cell.layout.textAnchor).replace('\n', '') //cell.layout.textAnchor.textSegments[0].content;
                // let obj = {[headers[num]]: cellText}

                rowData[headers[num] as keyof typeof rowData] = cellText;
                num++;
            }


            extractedData.push(rowData);
        }
        tables.push(extractedData)
    }

    let formFields: any = {}

    for (const field of result.document.pages[0].formFields) {
        formFields[getText(field.fieldName.textAnchor).replace('\n', '')] = getText(field.fieldValue.textAnchor).replace('\n', '');
    }


    invoiceStructuredData.tables = tables;
    invoiceStructuredData.formFields = formFields;
    invoiceStructuredData.ocr = result.document.text
    res.send(invoiceStructuredData);
    res.send("Hello from Firebase!");
});

import { GoogleAuth } from 'google-auth-library';
import * as fs from 'fs/promises';

async function main(targetAudience = 'us-documentai.googleapis.com', jsonCredentialsPath = './gcp-certification-415402-2f0d63c56edf.json') {
    try {
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

        const credentials = JSON.parse(await fs.readFile('functions/src/gcp-certification-415402-2f0d63c56edf.json', 'utf8'));


        async function getIdTokenFromServiceAccount() {
            const auth = new GoogleAuth({ credentials });

            // Get an ID token client.
            // The client can be used to make authenticated requests or you can use the
            // provider to fetch an id token.
            const client = await auth.getIdTokenClient(targetAudience);
            await client.idTokenProvider.fetchIdToken(targetAudience);

            console.log('Generated ID token.');
        }

        await getIdTokenFromServiceAccount();
        // [END auth_cloud_idtoken_service_account]
    } catch (error : any) {
        console.error(error.message);
        process.exitCode = 1;
    }
}

main(...process.argv.slice(2));

// Note: The module.exports is not required in TypeScript. If you are using TypeScript modules (TS >= 3.8),
// you can use export default main; instead.
