  import React, { useState, useEffect, useRef } from 'react'
  import './textEditor.css'
  import "jodit";
  import "jodit/build/jodit.min.css";
  import { useLocation } from 'react-router-dom';
  import textFile from '../../assets/images/textFile.png'
  import FileDownloadIcon from '@mui/icons-material/FileDownload';
  import ArticleIcon from '@mui/icons-material/Article';
  import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
  import SaveIcon from '@mui/icons-material/Save';
  import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
  import ModalShareUser from '../../components/modalShareUser/ModalShareUser';
  import { DocumentEditorContainerComponent, Print, ImageFormat, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog, Toolbar } from '@syncfusion/ej2-react-documenteditor';
  import {
    PdfBitmap,
    PdfDocument,
    PdfPageOrientation,
    PdfPageSettings,
    PdfSection,
    SizeF,
} from '@syncfusion/ej2-pdf-export';

  DocumentEditorContainerComponent.Inject(Toolbar, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog);

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
      zIndex: 999
    },
  };


  const TextEditor = () => {
    const { currentFolderId, currentFolder } = useSelector(state => state.currentFolder)
    const { currentUser } = useAuth()
    const { state } = useLocation()
    const [data, setData] = useState('');
    const [fileUrl, setFileUrl] = useState(state.url)
    const [initialRender, setInitialRender] = useState(true)
    const [showShareModal, setShowShareModal] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [chooseTemplate, setChooseTemplate] = useState(false)
    const [templateValue, setTemplateValue] = useState(null)
    const editorRef = useRef()

    // console.log(state)

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
                    new TextRun(editorRef.current.documentEditor.serialize()),
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
                // .where("name", "==", state.name)
                // .where("userId", "==", currentUser.uid)
                // .where("folderId", "==", currentFolder.id)
                .where("id", "==", state.id)
                .get()
                .then(existingFiles => {
                  const existingFile = existingFiles.docs[0]

                  console.log(existingFile)

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

                database.sharedFiles
                  .where("id", "==", state.id)
                  .get()
                  .then(files => {
                    files.docs.forEach(doc => {
                      doc.ref.update({
                        url: url
                      })
                    })
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


    const handleDownload = async () => {
      if (isChanged) {
        alert('Vui lòng nhấn lưu trước khi tải xuống!')
      }
      else {
        // // try {
        // //   const response = await fetch(fileUrl)

        // //   const blob = await response.blob();

        // //   const blobUrl = URL.createObjectURL(blob);

        // //   const link = document.createElement('a');
        // //   link.href = blobUrl;
        // //   link.download = state.name

        // //   document.body.appendChild(link);

        // //   link.click();

        // //   document.body.removeChild(link);
        // // }
        // // catch (err) {
        // //   console.error('Error downloading file:', err);
        // // }

        // const blob = new Blob([data], {
        //   type: 'application/msword'
        // });

        // const file = new File([blob], state.name, { type: 'application/msword' })

        // // Specify link url
        // const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(data);

        // // Specify file name

        // // Create download link element
        // const downloadLink = document.createElement("a");

        // document.body.appendChild(downloadLink);

        // if (navigator.msSaveOrOpenBlob) {
        //   navigator.msSaveOrOpenBlob(file, state.name);
        // } else {
        //   // Create a link to the file
        //   downloadLink.href = url;

        //   // Setting the file name
        //   downloadLink.download = state.name + '.doc';

        //   //triggering the function
        //   downloadLink.click();
        // }

        // document.body.removeChild(downloadLink);

        editorRef.current.documentEditor.save(state.name, 'Docx')
      }
    }

    const handleClearSelection = () => {
      setTemplateValue(null)
    }

    const handleShowModal = () => {
      setChooseTemplate(!chooseTemplate)
    }

    const handleSelectTemplate = () => {
      if (templateValue === template) {
        axios.get('https://firebasestorage.googleapis.com/v0/b/reportmanagementweb-409108.appspot.com/o/Self%20Assessment%20Report.docx?alt=media&token=957804c6-b14d-48fd-bea1-883b09b49f55', { responseType: 'arraybuffer' })
          .then(response => {
            mammoth.extractRawText({ arrayBuffer: response.data })
              .then((result) => {
                editorRef.current.documentEditor.open(result.value)
              })
              .catch((error) => {
                console.error('Error extracting text from DOCX:', error);
              });
          })
      }
      else if (templateValue === ttdn) {
        axios.get('https://firebasestorage.googleapis.com/v0/b/reportmanagementweb-409108.appspot.com/o/Internship%20Report.docx?alt=media&token=61ee0a88-45b7-4ba5-a219-6fcb1d9fd2d8', { responseType: 'arraybuffer' })
          .then(response => {
            mammoth.extractRawText({ arrayBuffer: response.data })
              .then((result) => {
                editorRef.current.documentEditor.open(result.value)
              })
              .catch((error) => {
                console.error('Error extracting text from DOCX:', error);
              });
          })
      }
      else {
        axios.get('https://firebasestorage.googleapis.com/v0/b/reportmanagementweb-409108.appspot.com/o/Graduation%20Thesis%20Report.docx?alt=media&token=bf0e445a-3173-4c49-a5b5-ea807f284dc7', { responseType: 'arraybuffer' })
          .then(response => {
            mammoth.extractRawText({ arrayBuffer: response.data })
              .then((result) => {
                editorRef.current.documentEditor.open(result.value)
              })
              .catch((error) => {
                console.error('Error extracting text from DOCX:', error);
              });
          })
      }

      setChooseTemplate(!chooseTemplate)
    }

    const handleShowShareModal = () => {
      setShowShareModal(!showShareModal)
    }

    const exportPdf = () => {
      let pdfDocument = new PdfDocument()
      let count = editorRef.current.documentEditor.pageCount

      editorRef.current.documentEditor.documentEditorSettings.printDevicePixelRatio = 2;

      let loadedPage = 0;

      for (let i = 1; i <= count; i++) {
        let format = 'image/jpeg'

        let image = editorRef.current.documentEditor.exportAsImage(i, format);

        image.onload = () => {
          let imageHeight = parseInt(
            image.style.height.toString().replace('px', '')
          );

          let imageWidth = parseInt(
            image.style.width.toString().replace('px', '')
          );

          let section = pdfDocument.sections.add()

          let settings = new PdfPageSettings(0)

          if (imageWidth > imageHeight) {
            settings.orientation = PdfPageOrientation.Landscape;
          }

          settings.size = new SizeF(imageWidth, imageHeight)

          section.setPageSettings(settings);

          let page = section.pages.add();

          let graphics = page.graphics;

          let imageStr = image.src.replace('data:image/jpeg;base64,', '');

          let pdfImage = new PdfBitmap(imageStr)

          graphics.drawImage(pdfImage, 0, 0, imageWidth, imageHeight);

          loadedPage++;

          if (loadedPage === count) {
            pdfDocument.save(state.name + '.pdf')
          }
        }
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
      editorRef.current.documentEditor.currentUser = currentUser.email

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
        // axios.get(state.url, { responseType: 'arraybuffer' })
        //   .then(response => {
        //     // console.log('response:', response.data)

        //     if (state.upload === true) {
        //       mammoth.convertToHtml({ arrayBuffer: response.data })
        //         .then((result) => {
        //           setData(result.value)
        //         })
        //         .catch((error) => {
        //           console.error('Error extracting text from DOCX:', error);
        //         });
        //     }
        //     else {
        //       mammoth.extractRawText({ arrayBuffer: response.data })
        //         .then((result) => {
        //           setData(result.value)
        //         })
        //         .catch((error) => {
        //           console.error('Error extracting text from DOCX:', error);
        //         });
        //     }
        //   })
        axios.get(state.url, {responseType: 'arraybuffer'})
          .then(response => {
            mammoth.extractRawText({ arrayBuffer: response.data })
                .then((result) => {
                  if (result.value !== '\n\n') {
                    editorRef.current.documentEditor.open(result.value)
                  }
                })
                .catch((error) => {
                  console.error('Error extracting text from DOCX:', error);
                });
          })
      }
    }, [])


    return (
      <div className="App" style={{ maxWidth: '80%', margin: "0 auto" }}>
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

              <div className='btn' onClick={exportPdf}>
                <PictureAsPdfIcon htmlColor='red' fontSize='small' />
              </div>

              {!state.hasOwnProperty('sharedUser') &&
                <div className='btn' onClick={handleShowShareModal}>
                <PersonAddAlt1Icon htmlColor='black' fontSize='small' />
              </div>
              }
            </div>
          </div>
        </div>

        {/* <DocumentEditorComponent
          id="container"
          height={'330px'}
          serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
          isReadOnly={false}
          enablePrint={true}
          enableSelection={true}
          enableEditor={true}
          enableEditorHistory={true}
          enableContextMenu={true}
          enableSearch={true}
          enableOptionsPane={true}
          enableBookmarkDialog={true}
          enableBordersAndShadingDialog={true}
          enableFontDialog={true}
          enableTableDialog={true}
          enableParagraphDialog={true}
          enableHyperlinkDialog={true}
          enableImageResizer={true}
          enableListDialog={true}
          enablePageSetupDialog={true}
          enableSfdtExport={true}
          enableStyleDialog={true}
          enableTableOfContentsDialog={true}
          enableTableOptionsDialog={true}
          enableTablePropertiesDialog={true}
          enableTextExport={true}
          enableWordExport={true} /> */}

        <DocumentEditorContainerComponent
          height='800'
          enableToolbar={true}
          ref={editorRef}
          serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
          contentChange={() => setIsChanged(true)}
          zIndex={-1}  
        >

          </DocumentEditorContainerComponent>

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

        <ModalShareUser isOpen={showShareModal} setIsOpen={setShowShareModal} file={{...state, url: fileUrl}}/>

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
            <Button className='resetPasswordBtn' style={{ width: 200, border: 'none' }} disabled={templateValue === null ? true : false} onClick={handleSelectTemplate}>
              Select
            </Button>
          </div>
        </Modal>
      </div>
    )
  }

  export default TextEditor
