import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import {
  translatedExtraCommands,
  translatedCommands
} from '../constants/md-editor-es';
import { useDarkTheme } from '@/layouts/hooks/useDarkTheme';
import '../css/md-editor.css';

export function WikiCreate() {
  const { isDark } = useDarkTheme();
  const [value, setValue] = useState<string>('');

  return (
    <div className="h-full py-4 px-2 gap-2 flex flex-col">
      <pre
        data-color-mode={isDark ? 'dark' : 'light'}
        className="container flex-1"
      >
        <MDEditor
          style={{ whiteSpace: 'pre-wrap' }}
          className="h-full!"
          value={value}
          onChange={(val) => setValue(val ?? '')}
          preview="live"
          textareaProps={{
            placeholder: 'Escribir documentación en formato Markdown'
          }}
          previewOptions={{
            rehypePlugins: [rehypeSanitize]
          }}
          commands={translatedCommands}
          extraCommands={translatedExtraCommands}
        />
      </pre>
      <div className="flex gap-6 justify-center items-center">
        <button className="btn btn-primary">Guardar</button>
        <button className="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  );
}
