import { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

/**
 * Lightweight WYSIWYG editor using browser contenteditable + execCommand.
 * Pass a `key` that changes when you want to reinitialise (e.g. key={item._id || 'new'}).
 */
const RichEditor = ({ value = '', onChange, dir = 'ltr', minHeight = 130 }) => {
  const editorRef = useRef(null);

  // Initialise content once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = useCallback((cmd, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleInput = useCallback(() => {
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const tools = [
    { icon: Bold,         cmd: 'bold',                title: 'Bold' },
    { icon: Italic,       cmd: 'italic',              title: 'Italic' },
    { icon: Underline,    cmd: 'underline',            title: 'Underline' },
    { icon: List,         cmd: 'insertUnorderedList',  title: 'Bullet list' },
    { icon: ListOrdered,  cmd: 'insertOrderedList',    title: 'Numbered list' },
    { icon: AlignLeft,    cmd: 'justifyLeft',          title: 'Align left' },
    { icon: AlignCenter,  cmd: 'justifyCenter',        title: 'Align center' },
    { icon: AlignRight,   cmd: 'justifyRight',         title: 'Align right' },
  ];

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-cyan-400 transition-colors bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {tools.map(({ icon: Icon, cmd, title }, i) => (
          <>
            {(i === 3 || i === 5) && <div key={`sep-${i}`} className="w-px h-4 bg-gray-300 mx-1" />}
            <button key={cmd} type="button" title={title}
              onMouseDown={e => { e.preventDefault(); exec(cmd); }}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          </>
        ))}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <select
          onMouseDown={e => e.preventDefault()}
          onChange={e => { if (e.target.value) { exec('formatBlock', e.target.value); e.target.value = ''; } }}
          className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 focus:outline-none cursor-pointer"
          defaultValue="">
          <option value="" disabled>Style</option>
          <option value="p">Normal</option>
          <option value="h2">Heading</option>
          <option value="h3">Sub-heading</option>
        </select>
        <button type="button" title="Clear formatting"
          onMouseDown={e => { e.preventDefault(); exec('removeFormat'); }}
          className="ms-auto text-xs px-2 py-0.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
          Clear
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dir={dir}
        className="px-4 py-3 text-sm text-gray-800 focus:outline-none rich-content"
        style={{ minHeight }}
      />
    </div>
  );
};

export default RichEditor;
