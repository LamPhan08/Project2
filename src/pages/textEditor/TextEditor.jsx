import React, { useState, useEffect, useRef } from 'react'
import './textEditor.css'
import "jodit";
import "jodit/build/jodit.min.css";
import JoditEditor from "jodit-react";
import { useLocation } from 'react-router-dom';
import textFile from '../../assets/images/textFile.png'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleIcon from '@mui/icons-material/Article';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios'
import mammoth from 'mammoth'
import template from '../../assets/images/template.png'
import ttdn from '../../assets/images/ttdn.png'
import kltn from '../../assets/images/kltn.png'
import Modal from 'react-modal'
import { Button } from 'react-bootstrap';
import { database, storage } from '../../firebase/firebase';
import { useSelector } from 'react-redux'
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { Document, Packer, Paragraph, TextRun } from "docx";

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
  "shape"
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
  // buttons: buttons,  
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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
  },
};


const TextEditor = () => {
  const { currentFolderId, currentFolder } = useSelector(state => state.currentFolder)
  const { currentUser } = useAuth()
  const { state } = useLocation()
  const [data, setData] = useState('');
  const [fileUrl, setFileUrl] = useState(state.url)
  const [initialRender, setInitialRender] = useState(true)
  const [isChanged, setIsChanged] = useState(false)
  const [chooseTemplate, setChooseTemplate] = useState(false)
  const [templateValue, setTemplateValue] = useState(null)
  const editorRef = useRef()

  const handleSave = async () => {
    if (currentFolder === null) {
      return
    }

    if (state.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || state.type === 'application/msword') {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun(editorRef.current.value),
                ],
              }),
            ],
          },
        ],
      });

      const fileData = await Packer.toBlob(doc)

      const blob = new Blob([fileData], { type: state.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword' });

      const file = new File([blob], `${state.name}${state.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? '.docx' : '.doc'}`, { type: state.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/msword' })

      const filePath = currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

      const uploadTask = storage
        .ref(`/files/${currentUser.uid}/${filePath}`)
        .put(file)

      uploadTask.on(
        "state_changed",
        () => {

        },
        () => {

        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            database.files
              .where("name", "==", state.name)
              .where("userId", "==", currentUser.uid)
              .where("folderId", "==", currentFolder.id)
              .get()
              .then(existingFiles => {
                const existingFile = existingFiles.docs[0]

                if (existingFile) {
                  existingFile.ref.update({
                    url: url,
                    upload: false
                  })
                  setFileUrl(url)
                } else {
                  console.log('unsaved')
                }
              })
          })
        }
      )

    }
    else {
      const blob = new Blob([data], { type: 'text/plain' });

      const file = new File([blob], `${state.name}.txt`, { type: 'text/plain' })

      const filePath = currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

      const uploadTask = storage
        .ref(`/files/${currentUser.uid}/${filePath}`)
        .put(file)

      uploadTask.on(
        "state_changed",
        () => {

        },
        () => {

        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            database.files
              .where("name", "==", state.name)
              .where("userId", "==", currentUser.uid)
              .where("folderId", "==", currentFolder.id)
              .get()
              .then(existingFiles => {
                const existingFile = existingFiles.docs[0]

                if (existingFile) {
                  existingFile.ref.update({
                    url: url,
                    upload: false
                  })
                  setFileUrl(url)
                } else {
                  console.log('unsaved')
                }
              })
          })
        }
      )
    }

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

  const handleClearSelection = () => {
    setTemplateValue(null)
  }

  const handleShowModal = () => {
    setChooseTemplate(!chooseTemplate)
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
          console.log('response:', response.data)

          if (state.upload === true) {
            mammoth.convertToHtml({ arrayBuffer: response.data })
              .then((result) => {
                setData(result.value)
              })
              .catch((error) => {
                console.error('Error extracting text from DOCX:', error);
              });
          }
          else {
            mammoth.extractRawText({ arrayBuffer: response.data })
              .then((result) => {
                setData(result.value)
              })
              .catch((error) => {
                console.error('Error extracting text from DOCX:', error);
              });
          }
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

            <div className='btn' onClick={handleShowModal}>
              <ArticleIcon htmlColor='green' fontSize='small' />
            </div>
          </div>
        </div>
      </div>

      <JoditEditor
        ref={editorRef}
        value={data}
        config={editorConfig}
        onChange={value => handleChange(value)}
        className='editor'
      />

      {/* {chooseTemplate &&
        <div className='chooseTemplateWrapper'>
          <div className='label'>Choose a template for your docx file</div>

          <label>
            <input
              type='checkbox'
              checked={isChecked}
              onChange={(value) => {
                setIsChecked(!isChecked)
                setTemplateValue(value)
              }}
              className='radioBtn'
            />

            <img src={template} alt='template' className='templateImg'/>
          </label>
        </div>
      } */}

      <Modal isOpen={chooseTemplate} onRequestClose={handleShowModal} style={customStyles}>
        <div style={{ justifyContent: 'end', display: 'flex' }}>
          <span className='closeBtn' onClick={handleShowModal}>&times;</span>
        </div>

        <div style={{ justifyContent: 'center', display: 'flex', marginBottom: 50 }}>
          <h2>Select Template </h2>
        </div>

        <form style={{ paddingLeft: 20, paddingRight: 20 }}>
          <div style={{ gap: 20, display: 'flex' }}>
            <div>
              <label style={{ cursor: 'pointer', border: templateValue === template ? '3px solid #FF9600' : '3px solid grey' }} >
                <input
                  type='radio'
                  className='radiobtn'
                  value={template}
                  checked={templateValue === template}
                  onChange={() => setTemplateValue(template)}
                />

                <img src={template} alt='' className='templateImg' />
              </label>

              <div style={{ textAlign: 'center', fontWeight: 500 }}>Self Assessment Report</div>
            </div>

            <div>
              <label style={{ cursor: 'pointer', border: templateValue === ttdn ? '3px solid #FF9600' : '3px solid grey' }} >
                <input
                  type='radio'
                  className='radiobtn'
                  value={ttdn}
                  checked={templateValue === ttdn}
                  onChange={() => setTemplateValue(ttdn)}
                />

                <img src={ttdn} alt='' className='templateImg' />
              </label>

              <div style={{ textAlign: 'center', fontWeight: 500 }}>Corporate Internship Report</div>
            </div>

            <div>
              <label style={{ cursor: 'pointer', border: templateValue === kltn ? '3px solid #FF9600' : '3px solid grey' }} >
                <input
                  type='radio'
                  className='radiobtn'
                  value={kltn}
                  checked={templateValue === kltn}
                  onChange={() => setTemplateValue(kltn)}
                />

                <img src={kltn} alt='' className='templateImg' />
              </label>

              <div style={{ textAlign: 'center', fontWeight: 500 }}>Graduation Thesis Report</div>
            </div>
          </div>


        </form>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button onClick={handleClearSelection} className='resetPasswordBtn' style={{ width: 200, border: 'none' }} disabled={templateValue === null ? true : false}>
            Clear Selection
          </Button>
          <Button className='resetPasswordBtn' style={{ width: 200, border: 'none' }} disabled={templateValue === null ? true : false}>
            Select
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default TextEditor
