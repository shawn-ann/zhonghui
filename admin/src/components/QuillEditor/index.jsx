import { useEffect, useRef, useState, useCallback } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { uploadApi } from '../../services/api'

export default function QuillEditor({ value, onChange }) {
  const editorRef = useRef(null)
  const quillInstance = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const isInitializing = useRef(true)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: '请输入内容...',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ size: ['small', false, 'large', 'huge'] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: function () {
                selectLocalImage()
              },
            },
          },
        },
      })

      quillInstance.current.on('text-change', function () {
        if (!isInitializing.current && onChangeRef.current) {
          const content = JSON.stringify(quillInstance.current.getContents())
          onChangeRef.current(content)
        }
      })
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (quillInstance.current && value) {
      try {
        const delta = JSON.parse(value)
        const currentContents = JSON.stringify(quillInstance.current.getContents())
        if (currentContents !== value) {
          isInitializing.current = true
          quillInstance.current.setContents(delta)
          setTimeout(() => {
            isInitializing.current = false
          }, 100)
        }
      } catch (e) {
        isInitializing.current = true
        quillInstance.current.setText(value)
        setTimeout(() => {
          isInitializing.current = false
        }, 100)
      }
    } else if (quillInstance.current && !value) {
      isInitializing.current = true
      quillInstance.current.setContents([])
      setTimeout(() => {
        isInitializing.current = false
      }, 100)
    }
  }, [value])

  const selectLocalImage = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        try {
          setIsUploading(true)
          const response = await uploadApi.upload(file)
          const imageUrl = `http://localhost:3000${response.data.url}`
          insertImageToEditor(imageUrl)
        } catch (error) {
          console.error('图片上传失败:', error)
          alert('图片上传失败，请重试')
        } finally {
          setIsUploading(false)
        }
      }
    }
  }

  const insertImageToEditor = (imageUrl) => {
    const range = quillInstance.current.getSelection()
    const index = range ? range.index : quillInstance.current.getLength()
    quillInstance.current.insertEmbed(index, 'image', imageUrl)
  }

  return (
    <div>
      {isUploading && (
        <div className="bg-blue-100 text-blue-700 px-3 py-1 text-sm mb-1">
          图片上传中...
        </div>
      )}
      <div
        ref={editorRef}
        style={{ height: '300px' }}
        className="bg-white"
      />
    </div>
  )
}
