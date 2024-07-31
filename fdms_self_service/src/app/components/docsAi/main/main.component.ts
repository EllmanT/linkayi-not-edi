import {Component, OnInit} from '@angular/core';
import {DocumentsAiServiceService} from "../../../services/documents-ai-service.service";
import {LinkServiceService} from "../../../services/link-service.service";
import {FormBuilder, FormGroup, ɵFormGroupRawValue, ɵGetProperty, ɵTypedOrUntyped} from "@angular/forms";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  data: any;
  selectedTab: string = 'selectedTab: string = \'document-upload\';';
  selectedTableIndex: number;
  selectedTableDetails: any;
    protected readonly Object = Object;
    loading: boolean = false;
    zimraForm: FormGroup;
    zimraFieldsKeyWords = {
      ['taxInclFields']:{
          description: ['description', 'desc'],
          quantity: ['qty', 'quantity'],
          vat: ['vat'],
          price: ['price', 'incl', 'in'],
          total: ['total', ['total(incl)']]
      },
      ['taxExclFields']: {
          description: ['description', 'desc'],
          quantity: ['qty', 'quantity'],
          amount: ['amount', 'amount(excl)', 'total', 'total(excl)'],
          vat: ['vat'],
          total: ['total', "total(incl)", 'incl']
      },
      ['reference']:['document#', 'reference number'],
      ['company']: {
          companyName: ['name'],
          tin: ['tin'],
          vat: ['vat'],
          email: ['@'],
          phone: '',
          address: ['address', ]
      }
  }

     validationZimraFieldsObject: IZimraFields = {
        documentNumber: '',
        companyFields: {
            vat: '',
            tin: '',
            companyName: '',
            physicalAddress: '',
            phone: '',
            email: '',
        },
        customerFields: {
            vat: '',
            tin: '',
            companyName: '',
            physicalAddress: '',
            phone: '',
            email: '',
        },
        lineColumns: {
            description: '',
            quantity: '',
            unitPrice: '',
            vat: '',
            totalIncl: '',
        },
    };

  constructor(
    private docsAiService: DocumentsAiServiceService,
    private linkService: LinkServiceService ,
    private formBuilder: FormBuilder
  ) {
      this.zimraForm = this.formBuilder.group({});
  }


  validationFields: IZimraFields;
    files: any[] = [];
  ngOnInit(): void {
    this.createFormControls();
  }
    createFormControls() {
        Object.keys(this.validationZimraFieldsObject).forEach(key => {
            if (typeof this.validationZimraFieldsObject[key as keyof typeof this.validationZimraFieldsObject] === 'object') {
                console.log(key)
                Object.keys(this.validationZimraFieldsObject[key as keyof typeof this.validationZimraFieldsObject]).forEach(subKey => {
                    let controlName = subKey
                    if (key === 'companyFields'){
                        controlName = controlName + "_companyFields"
                    }
                    if (key === 'customerFields'){
                        controlName = controlName + '_customerFields'
                    }
                    console.log(controlName)
                    this.zimraForm.addControl(controlName, this.formBuilder.control(''));
                });
            } else {
                console.log('else key: ', key)
                this.zimraForm.addControl(key, this.formBuilder.control(''));
            }
        });
    }
  validateTaxInclColumns(){
      const lineItems: IColumnsTaxIncl = {
          description: '',
          quantity: '',
          unitPrice: '',
          vat: '',
          totalIncl: '',
      }
      if (this.selectedTableDetails){
          let tableColumns = [];

          for (const propKey of Object.keys(this.zimraFieldsKeyWords.taxInclFields)){
              for (const key of Object.keys(this.selectedTableDetails[0])){
                  let splitArray = key.split(/[\s()]/);
                  for (const split of splitArray ){
                      if (this.zimraFieldsKeyWords.taxInclFields[propKey as keyof typeof this.zimraFieldsKeyWords.taxInclFields].includes(split.toLocaleLowerCase())) {
                          lineItems[propKey as keyof IColumnsTaxIncl] = key
                      }
                  }


              }
          }

          this.validationZimraFieldsObject.lineColumns = lineItems;
          console.log(lineItems)

      }
  }

    validateTaxExclColumns(){
        const lineItems: IColumnsTaxIncl = {
            description: '',
            quantity: '',
            unitPrice: '',
            vat: '',
            totalIncl: '',
        }
        if (this.selectedTableDetails){
            let tableColumns = [];

            for (const propKey of Object.keys(this.zimraFieldsKeyWords.taxExclFields)){
                for (const key of Object.keys(this.selectedTableDetails[0])){
                    let splitArray = key.split(/[\s()]/);
                    for (const split of splitArray ){
                        if (this.zimraFieldsKeyWords.taxExclFields[propKey as keyof typeof this.zimraFieldsKeyWords.taxExclFields].includes(split.toLocaleLowerCase())) {
                            lineItems[propKey as keyof IColumnsTaxIncl] = key
                        }
                    }


                }
            }

            this.validationZimraFieldsObject.lineColumns = lineItems;
            console.log(lineItems)

        }
    }

    validateOtherFields(){

    }

    onSelect(event:any) {
        this.files.push(...event.addedFiles);
    }
    onRemove(event:any) {
        this.files.splice(this.files.indexOf(event), 1);
    }
  async onFileSelected(event: any) {
      this.loading = true;
    this.onSelect(event);
      console.log(event)
    const file: File = event.addedFiles[0];

      console.log(file);

    if (file) {
      const base64String: string = await this.encodeFileInBase64(file);
      this.data = await this.docsAiService.uploadRequestFile({ doc: base64String }).toPromise();
      this.selectedTab = 'key'
      console.log(this.data)
        this.loading = false;

        let mentions = this.mapMentions(this.data?.document?.entities)

        console.log("mentions: ", mentions)

        this.docsAiService.generateTextFile(mentions)
    }
  }

    mapMentions(mentions: Mention[]): { [key: string]: string } {
        const mappedMentions: { [key: string]: string } = {};
        mentions.forEach(mention => {
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
    getObjectProperties(obj: any): { name: string; value: any }[] {
        return Object.entries(obj).map(([name, value]) => ({ name, value }));
    }
    isObject(value: any): boolean {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getSubObject(obj: any, key: any){
      return obj[key as keyof typeof obj]
  }


    objectA = { name: 'mello', surname: 'melo' };
    objectB = { name: 'madara', surname: 'uchiha' };
    linkProperties() {
        this.linkService.linkProperties('name', 'surname');
        this.linkService.linkProperties('surname', 'name');
    }
    selectedTable(table: any) {
        console.log('selected table: ', table)
        this.selectedTableDetails = table;
        this.validateTaxInclColumns()
    }

    updateZimraObj(obj: ICompanyDetails | IColumnsTaxIncl | IColumnsTaxExcl, subKey: string, value: ɵGetProperty<ɵTypedOrUntyped<any, ɵFormGroupRawValue<any>, any>, string> | undefined) {
        console.log(value)
        obj[subKey as keyof typeof obj] = value;
        console.log(this.validationZimraFieldsObject)
    }
    updateZimraObjLineItems(lineColumns: IColumnsTaxIncl | IColumnsTaxExcl, subKey: string, value: ɵGetProperty<ɵTypedOrUntyped<any, ɵFormGroupRawValue<any>, any>, string> | undefined) {
        console.log(value)
        lineColumns[subKey as keyof typeof lineColumns] = value;
        console.log(this.validationZimraFieldsObject)
    }
}

// export  interface ICompanyDetails  {
//   vat: {available:  boolean, key: string, value: any};
//   tin: {available:  boolean, key: string, value: any};
//   companyName: {available:  boolean, key: string, value: any};
//   physicalAddress: {available:  boolean, key: string, value: any};
//   phone: {available:  boolean, key: string, value: any};
//   email: {available:  boolean, key: string, value: any};
// }

export  interface ICompanyDetails  {
    vat: string;
    tin: string;
    companyName: string;
    physicalAddress: string;
    phone: string;
    email: string;
}

export interface IColumnsTaxIncl {
  description: string;
  quantity: string;
  vat: string;
  totalIncl: string | undefined | '';
  unitPrice: string | undefined | '';
}

export interface IColumnsTaxExcl {
    description: string;
    quantity: string;
    unitPrice: string | undefined | '';
    vat: string;
    totalIncl: string | undefined | '';
}

export interface IZimraFields {
    documentNumber: 'Document No' | 'Reference Number' | '';
    companyFields: ICompanyDetails;
    customerFields: ICompanyDetails;
    lineColumns: IColumnsTaxIncl | IColumnsTaxExcl;
}

interface Mention {
    mentionText: string;
    type: string;
}
