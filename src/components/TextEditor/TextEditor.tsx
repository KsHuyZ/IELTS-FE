import { Component } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./TextEditorImage.css";
interface TextEditorImageProps {
  content: string;
  onChange: (data: string) => void;
}
class TextEditorImage extends Component<TextEditorImageProps> {
  render() {
    const { content, onChange } = this.props;
    const custom_config: any = {
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "alignment",
          "outdent",
          "indent",
          "|",
          "imageInsert",
          "insertTable",
          "blockQuote",
          "undo",
          "redo",
        ],
      },
      language: "en",
      image: {
        toolbar: [
          "imageTextAlternative",
          "imageStyle:full",
          "imageStyle:side",
          "imageStyle:alignLeft",
          "imageStyle:alignCenter",
          "imageStyle:alignRight",
          "resizeImage",
          "linkImage",
        ],
        styles: ["full", "side", "alignLeft", "alignCenter", "alignRight"],
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      licenseKey: "",
    };
    return (
      <CKEditor
        editor={ClassicEditor}
        config={custom_config}
        data={content}
        onChange={(event, editor) => {
          const typedData = editor.getData();
          console.log(event);
          console.log(typedData);
          onChange(typedData);
        }}
        onReady={(editor) => {
          console.log("Editor is ready to use!", editor);
        }}
        // disabled={readOnly ? true : false}
      />
    );
  }
}

export default TextEditorImage;
