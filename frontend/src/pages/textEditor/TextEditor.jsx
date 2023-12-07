import React, { useState } from 'react'
import './textEditor.css'
import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";


const buttons = [
  "undo",
  "redo",
  "|",
  "font",
  "fontsize",
  "bold",
  "strikethrough",
  "underline",
  "italic",
  "|",
  "superscript",
  "subscript",
  "|",
  "align",
  "|",
  "ul",
  "ol",
  "outdent",
  "indent",
  "|",
  "brush",
  "paragraph",
  "|",
  "image",
  "link",
  "table",
  "|",
  "fullsize",
];

const editorConfig = {
  readonly: false,
  toolbar: true,
  spellcheck: true,
  language: "en",
  toolbarButtonSize: "medium",
  toolbarAdaptive: true,
  showCharsCounter: true,
  showWordsCounter: true,
  showXPathInStatusbar: false,
  askBeforePasteHTML: true,
  askBeforePasteFromWord: true,
  //defaultActionOnPaste: "insert_clear_html",
  buttons: buttons,
  autofocus: true,
  uploader: {
    insertImageAsBase64URI: true
  },
  width: window.innerWidth * 0.8,
  minHeight: 300,
  showTooltip: true,
  search: true,
  showTooltipDelay: 100,
  style: {
    textAlign: 'left',
    paddingLeft: 20
  },
  containerStyle: {
    marginTop: 20,
    boxShadow: '0px 10px 30px -15px rgba(0, 0, 0, 0.3)',
  },
  showPlaceholder: false,
}


const TextEditor = () => {
  const [data, setData] = useState('');
  console.log(data)

  return (
    <div className="App" style={{ maxWidth: editorConfig.width, margin: "0 auto" }}>
      <JoditEditor
        value={data}
        config={editorConfig}
        onChange={value => setData(value)}
        className='editor'
      />
    </div>
  )
}

export default TextEditor
