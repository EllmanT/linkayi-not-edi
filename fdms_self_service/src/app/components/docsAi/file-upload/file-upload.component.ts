import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { NgForOf, NgIf } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DocumentsAiServiceService } from '../../../services/documents-ai-service.service';
import { LinkServiceService } from '../../../services/link-service.service';
import { FormBuilder, PatternValidator } from '@angular/forms';
import { C, a } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  invoiceFiles: any[] = [];
  creditNoteFiles: any[] = [];
  loading = false;
  data: any;
  selectedTableDetails: any;
  settingJSON: any;
  invoiceNumberPos: boolean = false;
  invoiceValidationMessage: string[] = [];
  creditNoteValidationMessage: string[] = [];
  isCreditNoteValid: boolean = true;
  isInvoiceValid: boolean = true;
  capturedFields: { invoice: {} | undefined; creditNote: {} | undefined } = {
    invoice: undefined,
    creditNote: undefined
  };

  constructor(
    private docsAiService: DocumentsAiServiceService,
    private linkService: LinkServiceService
  ) {}
  onSelect(event: any, type: string): void {
    //@ts-expect-error
    this[`${type}Files`].push(...event.addedFiles);
  }
  onRemove(event: any, type: string): void {
    //@ts-expect-error
    this[`${type}Files`].splice(this[`${type}Files`].indexOf(event), 1);
  }

  async onFileSelected(event: any, type: string) {
    this.loading = true;
    this.onSelect(event, type);
    console.log(event);
    const file: File = event.addedFiles[0];

    console.log(file);

    if (file) {
      const base64String: string = await this.encodeFileInBase64(file);
      this.data = await this.docsAiService
        .uploadRequestFile({ doc: base64String })
        .toPromise();

      console.log(this.data);

      const data1 = this.data;

      this.data = await this.docsAiService
        .uploadRequestFile2({ doc: base64String })
        .toPromise();
      const data2 = this.data;

      this.loading = false;

      console.log(data2);
      //end of the conversion
      let mentions = this.mapMentions(data1?.document?.entities);

      console.log('mentions: ', mentions);
      if (this.invoiceNumberPos) {
        mentions['INVOICENUMBERPOS'] = 'LAST';
      } else {
        mentions['INVOICENUMERPOS'] = '';
      }

      this.capturedFields[type as keyof typeof this.capturedFields] = mentions;

      console.log('capturedFields: ', this.capturedFields);


      //checking for the banking details
      //dividing the text into 3 sections
      var newTextDoc = data1?.document?.text;
      var errorMessages = [];
      var validity = true;
      //section 1 of the document
      var section1endWord = mentions['QUANTITY'];
      var section2endWord =
        mentions['END1'] !== null ? mentions['END1'] : mentions['END2'];
      console.log(section1endWord);
      console.log(section2endWord);
      var section1ending = newTextDoc.indexOf(section1endWord);
      var section2ending = newTextDoc.indexOf(section2endWord);
      // Extracting the different sections
      var section1 = newTextDoc.substring(0, section1ending);
      var section2 = newTextDoc.substring(section1ending, section2ending);
      var section3 = newTextDoc.substring(section2ending);
      console.log(section1);
      console.log(section2);
      console.log(section3);

      //Checking for the presence of the section 1 requirements
      var vatCount = (section1.match(/v\.?a\.?t/gi) || []).length;
      var tinCount = (section1.match(/t\.?i\.?n/gi) || []).length;
      var isEmailPresent = section1.includes('@');
      var phoneNumberRegex =
        /(\b07|\b08|\+263|\b263|\b242|\b020|\b04|\b06|\b03|\b05|\b01|\b7)/g;
      var isPhoneNumberPresent = section1.match(phoneNumberRegex);

      //for the invoice
      //CHECKING TO SEE IF THE INVOICE IS VALID
      // var isInvoiceNumberValid = true;

      if (this.capturedFields.creditNote === undefined) {
        var invoiceNumber = mentions['INVOICENUMBER'].toLowerCase();

        const checkFields = (mention: string, value: string) => {
          var status = false;

          // check if contains value inn mention
          if (mention.includes(value)) {
            return true;
          }

          return status;
        };

        //  !checkFields(invoiceNumber, 'ref') && !checkFields(invoiceNumber, 'doc') ?? validity = falseerrorMessages.push(
        //     'Invoice Number is Invalid. (Must be labelled document No. or Reference No.)'
        //    );

        //  console.log(checkFields(invoiceNumber, 'ref'), 'mq')

        if (!invoiceNumber.includes('doc') && !invoiceNumber.includes('ref')) {
          errorMessages.push(
            'Invoice Number is Invalid. (Must be labelled document No. or Reference No.)'
          );
          validity = false;
        }
      }

      console.log(validity);
      if (vatCount >= 2) {
        console.log('Vat number present');
        //validity=true;
        //  errorMessages.push('2 or more VAT fields are present');
      } else {
        console.log('vat is not present');
        validity = false;
        errorMessages.push('1 or more VAT fields are missing');
      }
      if (tinCount >= 2) {
        console.log('tin is present');
        //  errorMessages.push('2 or more TIN fields are present');
      } else {
        validity = false;
        errorMessages.push('1 or more TIN fields are missing ');
      }

      if (isEmailPresent) {
        console.log('Email is present');
      } else {
        console.log('email is not present');
        validity = false;
        errorMessages.push('The company email is missing ');
      }

      if (isPhoneNumberPresent) {
        console.log(isPhoneNumberPresent);
      } else {
        console.log('no numbers found');
        errorMessages.push('The company phone/tel number is missing ');
        validity = false;
      }

      console.log(errorMessages);
      console.log(validity);
      console.log(isPhoneNumberPresent);

      //checking for the requirements in section 2
      var isWordTaxPresent =
        section2.toLowerCase().match(/tax|t\.?a\.?x/gi) !== null ||
        section3.toLowerCase().match(/tax|t\.?a\.?x/gi) !== null;

      if (isWordTaxPresent) {
        errorMessages.push('Change the word tax to VAT');
        validity = false;
      }
      {
        console.log('The word Tax is not present');
      }

      //cHECKING TO SEE IF THE AMOUNTS ARE EXCLUSIVE OR INCLUSIVE OF VAT

      //Begining of the validation

      const filteredData = [];
      var unitPrice = mentions['UNITPRICE'];
      var quantity = mentions['QUANTITY'];
      var start1 = mentions['START1'];
      var start2 = mentions['START2'];

      //ensuring that our start1 is populated
      if (start1 === undefined && start2 !== undefined) {
        start1 = start2;
      }
      let hasQtyUnitPrice = false;

      console.log('unit price', unitPrice);
      // console.log('SECTION1 END', section1endWord);
      console.log(quantity);
      console.log('start1', start1);
      // console.log("section 1 amount", sectio)
      console.log(data2);
      for (const subArray of data2) {
        for (const obj of subArray) {
          //mathcing to see the occurance of the properties
          //THe ai that gets the table contents sometimes gets some texts joined
          //Here we are checking to see the data the the ai gets and then ensuring that
          //our varialbles are the same as the properties that are returned by the ai
          for (const key in obj) {
            //    const value = obj[key].toString();
            //const containsNumbers = /\d/.test(value);
            if (
              //ensuring that the quantity is a number
              obj[key] !== '' &&
              key.startsWith(quantity) &&
              !key.includes(unitPrice) &&
              (typeof obj[key] === 'number' ||
                (typeof obj[key] === 'string' &&
                  /\d/.test(obj[key]) &&
                  !/\n/.test(obj[key])))
            ) {
              console.log(`Found "${quantity}" in the "${key}" property.`);
              hasQtyUnitPrice = true;
              quantity = key;
              //break;
              console.log(quantity);
            } else {
              console.log('cant find the quantity');
            }
            if (
              //ensuring that the unit price is valid and that it is a number
              obj[key] !== '' &&
              key.startsWith(unitPrice) &&
              !key.includes(quantity) &&
              (typeof obj[key] === 'number' ||
                (typeof obj[key] === 'string' &&
                  /\d/.test(obj[key]) &&
                  !/\n/.test(obj[key])))
            ) {
              console.log(`Found "${unitPrice}" in the "${key}" property.`);
              hasQtyUnitPrice = true;
              unitPrice = key;
              //break;
              console.log(unitPrice);
            }
          }

          if (
            obj.hasOwnProperty(unitPrice) &&
            obj.hasOwnProperty(quantity) &&
            obj.hasOwnProperty(start1)
          ) {
            console.log('working');
            //console.log(obj.hasOwnProperty)
            filteredData.push(obj);
          } else {
            console.log('failed');
          }
        }
      }

      console.log(hasQtyUnitPrice);
      //  console.log('start of the filtered data');
      //  console.log(filteredData);
      //   console.log('end of the filtered data');

      const firstObject = filteredData[0];
      //   console.log('first filtered object');
      console.log(filteredData);
      console.log(firstObject);
      //  console.log('end of the filtered object');

      //  console.log(firstObject.unitPrice)

      //We only perfirm the validation if filteredData is true.
      //Limitation the credit note sometimes does not give us the properties for the table data
      //In that case we just assume that the information the pricing that was used in the invoices is consistent wth that in the credit note

      //Performing calculations so that we check to see if pricing is inclusive or exclusive and validating the outputs accordingly
      if (filteredData.length !== 0) {
        //  const unfilteredPrice = firstObject[unitPrice].replace(/\D/g, ''); // Remove non-numeric characters
        // const unfilteredQuantity = firstObject[quantity].replace(/\D/g, ''); // Remove non-numeric characters
        const numericStr = firstObject[unitPrice]
          .replace(/[^\d.]/g, '')
          .replace(/,/g, ''); // Remove non-numeric charac
        const unitPriceAmount = firstObject[unitPrice];
        const quantityAmount = firstObject[quantity];
        console.log(quantity);
        console.log(firstObject[quantity]);
        console.log(quantityAmount);
        console.log(unitPriceAmount);

        const totalAmount = unitPriceAmount * quantityAmount;
        const exclVatAmount = totalAmount * 0.15;
        const inclVatAmount = ((totalAmount / 1.15) * 0.15).toFixed(2);
        const firstObjectKeys = Object.keys(firstObject);

        let totalInclVat = 0;
        let totalExclVat = 0;
        let vatInclFound = false;
        let vatExclFound = false;
        let isTemplateExcl = false;
        let istemplateIncl = false;
        let errorMessagesCount = 0;
        let isPatternTrue = false;
        let isPatternTrueAndExcl = false;
        let isPatternTrueAndIncl = false;

        console.log(firstObjectKeys);
        console.log(inclVatAmount);
        console.log(250000 * 200);

        //checking to see if the quantity and the unit price are filled in
        if (unitPriceAmount === undefined) {
          errorMessages.push('The Unit Price is empty / unreadable');
          validity = false;
        }
        if (quantityAmount === undefined) {
          errorMessages.push('Quantity column is empty / unreadable');
          validity = false;
        }

        //start of dealing with quickbooks scenario Also checking whether it is exclusive or inclusive
        for (const key of firstObjectKeys) {
          //the vat added to the code is buggy so I have removed it entirely
          //assuming that all qb will have percentage
          //const pattern = /15(\.\d+)?%|VAT/i;
          const pattern = /15(\.\d+)?%/;
          const includesVariations = pattern.test(firstObject[key]);

          if (includesVariations) {
            console.log(
              `String "${firstObject[key]}" includes the variations.`
            );
            isPatternTrue = true;

            //checking to see of the pricing is inclusive

            //checking to see of the pricing is exclusive
          } else {
            console.log(
              `String "${firstObject[key]}" does not include the variations.`
            );
          }
        }

        console.log(isPatternTrue);
        //end of dealing with quickbooks scenario

        //THis works for non quickbooks
        for (const key of firstObjectKeys) {
          //dealing with comma seperator for larger amounts
          const firstObjectKeysNoCommaSpace = firstObject[key].replace(
            /[, ]/g,
            ''
          );
          console.log(firstObjectKeysNoCommaSpace);
          if (
            firstObjectKeysNoCommaSpace.includes(inclVatAmount) ||
            isPatternTrue === true
          ) {
            console.log(
              `Property "${key}" in firstObject contains the value of inclVatAmount.`
            );
            console.log(inclVatAmount);
            console.log(isPatternTrue);
            vatInclFound = true;
            totalInclVat = totalAmount;
            console.log(firstObject);

            const totalInclVatVerifier = quantityAmount * unitPriceAmount;
            console.log(totalInclVatVerifier);

            console.log(totalInclVat, 'The inclusive amount');
            if (vatInclFound) {
              for (const key of firstObjectKeys) {
                //dealing with the comma seperator issue
                const commaTotalAmount = firstObject[key].replace(/[, ]/g, '');

                console.log(firstObject[key]);
                errorMessagesCount++;
                if (commaTotalAmount.includes(totalInclVat)) {
                  //final verification to test if the amounts are inclusive of vat
                  if (totalInclVatVerifier === totalInclVat) {
                    istemplateIncl = true;
                    isTemplateExcl = false;

                    console.log('template pricing is inclusive of vat');
                    console.log(totalInclVat);

                    const errorMessageToRemove =
                      'The Unit Price is Inc of VAT. You must have a column for the total Incl of VAT';
                    const index = errorMessages.indexOf(errorMessageToRemove);
                    if (index !== -1) {
                      errorMessages.splice(index, 1);
                    }
                    //we only break the looping once we have reached our target
                    console.log(istemplateIncl, 'Template is inclusive of vat');
                    // istemplateIncl=true;
                    if (errorMessages.length === 0) {
                      validity = true;
                    }
                    break;
                  }
                } else {
                  console.log('The incl price is not found');
                  if (errorMessagesCount === 1) {
                    errorMessages.push(
                      'The Unit Price is Inc of VAT. You must have a column for the total Incl of VAT'
                    );
                    validity = false;
                  }
                }

                //  break;
              }
            }
          } else {
            console.log('Identical Incl Vat not yet found');
          }
          if (
            firstObjectKeysNoCommaSpace.includes(exclVatAmount) ||
            isPatternTrue === true
          ) {
            console.log(
              `Property "${key}" in firstObject contains the value of exclVatAmount.`
            );
            console.log(exclVatAmount);
            console.log(isPatternTrue);
            vatExclFound = true;
            totalExclVat = totalAmount + exclVatAmount;
            console.log(firstObject);

            console.log(totalExclVat, 'The exclusive amount');
            if (vatExclFound && istemplateIncl === false) {
              for (const key of firstObjectKeys) {
                errorMessagesCount++;
                console.log('Item', firstObject[key]);
                console.log('total amount', totalAmount);

                //dealing with numbers that have commas
                const commaTotalAmount = firstObject[key].replace(/[, ]/g, '');

                console.log('Comma firstObject', commaTotalAmount);

                if (
                  firstObjectKeysNoCommaSpace.includes(totalAmount) ||
                  commaTotalAmount.includes(totalAmount)
                ) {
                  //verifying if the amount is exclusivee
                  //this also deals with the quickbooks situation
                  for (const key of firstObjectKeys) {
                    // console.log(firstObject[key]);

                    //dealing with numbers that have commas
                    const commaTotalExclVat = firstObject[key].replace(
                      /[, ]/g,
                      ''
                    );

                    console.log('Comma firstObject', commaTotalExclVat);

                    if (
                      firstObjectKeysNoCommaSpace.includes(totalExclVat) ||
                      commaTotalExclVat.includes(totalExclVat)
                    ) {
                      isTemplateExcl = true;
                      istemplateIncl = false;
                      console.log('template pricing is exclusive of vat');
                      console.log(totalExclVat);

                      const errorMessageToRemove =
                        'The Unit Price is Excl of VAT. You must have a column for the Total Excl of VAT and a Total Incl of VAT ';
                      const index = errorMessages.indexOf(errorMessageToRemove);
                      if (index !== -1) {
                        errorMessages.splice(index, 1);
                      }
                      console.log(
                        isTemplateExcl,
                        'The template is exclusive of vat'
                      );
                      if (errorMessages.length === 0) {
                        validity = true;
                      }
                      //we only break the looping once we have reached our target
                      break;
                    }
                  }
                } else {
                  console.log('The excl price is not found');
                  if (errorMessagesCount === 1) {
                    errorMessages.push(
                      'The Unit Price is Excl of VAT. You must have a column for the Total Excl of VAT and a Total Incl of VAT '
                    );
                    validity = false;
                  }
                }

                //  break;
              }
            }
          } else {
            console.log('Identical Excl Vat not yet found');
          }
        }

        //update the cod
      } else {
        //catering for when the system fails to read the line items for the vat for the invoice
        //We dont want the system to crash because we failed to read the line items

        console.log('system failed to read the info for the filtered data');
        if (
          this.capturedFields.invoice !== undefined &&
          this.capturedFields.creditNote === undefined
        ) {
          this.invoiceValidationMessage.push('You can download the Settings');
          this.invoiceValidationMessage.push(
            'NB. Failed to read whether your pricing is inclusive or exclusive of VAT'
          );
          this.invoiceValidationMessage.push(
            'Email your templates to  templates@axissol.com for verification'
          );

          console.log(this.invoiceValidationMessage);
        }

        //catering for when the system fails to read the line items for the the vat calculations for the credit note

        //if(this.capturedFields.invoice!==undefined && this.capturedFields.creditNote!==undefined){

        //if the invoice is valid and the credit note fails
        //we should just assume the pricing type is the same for the credit note
        //   if(this.isInvoiceValid===true){
        //    this.creditNoteValidationMessage.push("You can download the Settings but please note :")
        //   this.creditNoteValidationMessage.push("Failed to read whether your pricing is inclusive or exclusive of VAT")
        //  this.creditNoteValidationMessage.push("Contact a technician to confirm this for you.")

        //   }else{

        //  }

        // }
      }

      //console.log(this.capturedFields)

      // end of validating the units

      // END OF CHECKING TO SEE IF THE AMOUNT ARE EXCLUSIVE OR INCLUSIVE OF VAT

      // updating the information for the invoice
      if (this.capturedFields.creditNote === undefined) {
        this.isInvoiceValid = validity;

        if (errorMessages.length === 0) {
          this.invoiceValidationMessage.push(
            'All required fields for the Invoice are present!'
          );
        } else {
          this.invoiceValidationMessage = errorMessages;
        }

        errorMessages = [];
        validity = true;

        console.log(validity);
        console.log(this.isInvoiceValid);
        console.log(this.invoiceValidationMessage);
      } else {
        var isReasonPresent = newTextDoc.toLowerCase().includes('reason');
        if (isReasonPresent) {
          console.log('The reason is present');
        } else {
          errorMessages.push('The reason field is missing in the invoice');
          validity = false;
        }
        this.isCreditNoteValid = validity;

        if (errorMessages.length === 0) {
          this.creditNoteValidationMessage.push(
            'All required fields for the Credit Note are present!'
          );
        } else {
          this.creditNoteValidationMessage = errorMessages;
        }
        errorMessages = [];
        validity = true;
      }

      //updating the information for the credit note

      //console.log(this.invoiceValidationMessage)
      //if we have the credit note//

      //end of the validations
    }
  }

  async generateTextFile() {
    this.loading = true;
    this.docsAiService.generateTextFile(this.capturedFields);
    this.loading = false;
  }

  async refresh() {
    location.reload();
  }

  mapMentions(mentions: Mention[]): { [key: string]: string } {
    const mappedMentions: { [key: string]: string } = {};
    mentions.forEach((mention) => {
      mappedMentions[mention.type] = mention.mentionText;
    });
    return mappedMentions;
  }

  private async encodeFileInBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result: string | ArrayBuffer | null = reader.result;
        if (typeof result === 'string') {
          const base64String = result.split(',')[1]; // Extract the base64 portion
          resolve(base64String);
        } else {
          reject(new Error('Invalid result type'));
        }
      };

      // Read the file as Data URL, which will be in base64 format
      reader.readAsDataURL(file);
    });
  }

  setCompleteStatus(stepper: MatStepper) {
    stepper.selected!.completed = true;
    stepper.next();
  }
}
interface Mention {
  mentionText: string;
  type: string;
}
