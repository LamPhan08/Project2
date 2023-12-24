import React, { useState, useEffect } from 'react'
import './textEditor.css'
import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
import { useLocation } from 'react-router-dom';
import textFile from '../../assets/images/textFile.png'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios'
import mammoth from 'mammoth'

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
    paddingLeft: 20,
    zIndex: 0
  },
  containerStyle: {
    marginTop: 20,
    boxShadow: '0px 10px 30px -15px rgba(0, 0, 0, 0.5)',
    zIndex: 0
  },
  showPlaceholder: false,

}


const TextEditor = () => {
  const { state } = useLocation()
  const [data, setData] = useState('');
  const [initialRender, setInitialRender] = useState(true)
  const [isChanged, setIsChanged] = useState(false)

  const handleSave = () => {
    setIsChanged(false)
  }


  const handleChange = (text) => {
    if (!initialRender) {
      setData(text)

      setIsChanged(true)
    }

    setInitialRender(false)
  }

  const handleDownload = () => {
    if (isChanged) {
      alert('Vui lòng nhấn lưu trước khi tải xuống!')
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isChanged) {
        const message = "Bạn có chắc chắn muốn rời khỏi trang?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isChanged]);

  useEffect(() => {
    if (state.type === 'text/plain') {
      axios.get(state.url)
        .then(response => {
          const htmlText = response.data
            .split('\n')
            .map(line => `<p>${line}</p>`)
            .join('')

          setData(htmlText)
        })
    }
    else {
      axios.get(state.url, { responseType: 'arraybuffer' })
        .then(response => {
          mammoth.convertToHtml({ arrayBuffer: response.data })
            .then((result) => {
              setData(result.value)
            })
            .catch((error) => {
              console.error('Error extracting text from DOCX:', error);
            });
        })
    }
  }, [])


  return (
    <div className="App" style={{ maxWidth: editorConfig.width, margin: "0 auto" }}>
      <div className='optionsWrapper'>
        <img src={textFile} alt='' className='icon' />

        <div className='toolbarNameWrapper'>
          <div className='toolbarFileName'>{state.name}</div>

          <div className='btnWrapper'>
            <div className='btn' onClick={handleDownload}>
              <FileDownloadIcon color='info' fontSize='small' />
            </div>

            <div className={`btn ${isChanged ? '' : 'disabledBtn'}`} onClick={handleSave}>
              <SaveIcon htmlColor='#FF9600' fontSize='small' />
            </div>
          </div>
        </div>
      </div>

      <JoditEditor
        value={data}
        config={editorConfig}
        onChange={value => handleChange(value)}
        className='editor'
      />
    </div>
  )
}

export default TextEditor
