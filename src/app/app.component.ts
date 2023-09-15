import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import * as xml2js from 'xml2js';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select File';
  fileInfos?: Observable<any>;
  showEditorWindow: boolean = false;
  markdown = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max`;
  xmlData: string ='';

  constructor() {}

  ngOnInit(): void {
  
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
      console.log(this.currentFile, "currentFile");
      const reader = new FileReader();

      reader.onload = (e) => {
        this.xmlData = e.target?.result as string;
        this.convertXmlToPdf();
      };
      reader.readAsText(this.currentFile);

    } else {
      this.fileName = 'Select File';
    }
  }
  async convertXmlToPdf() {
    if (!this.xmlData) {
      // Handle the case where XML data is not available.
      return;
    }

    try {
      // Parse the XML data to a JavaScript object using xml2js.
      const parser = new xml2js.Parser();
      const jsonData = await parser.parseStringPromise(this.xmlData);

      // Create a PDF document using pdfmake.
      const docDefinition = {
        content: [
          {
            text: 'XML to PDF Conversion Example',
            style: 'header',
          },
          JSON.stringify(jsonData, null, 2), 
        ],
      };

      pdfMake.createPdf(docDefinition).download("test.pdf");
    } catch (error) {
      console.error('Error converting XML to PDF:', error);
    }

  }

  upload(): void {

    if(this.fileName !== 'Select File') {
      this.showEditorWindow = true;
    }


  }

}
