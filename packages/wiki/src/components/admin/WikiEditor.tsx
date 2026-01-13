import React, { useState } from 'react';
import markdownit from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'react-markdown-editor-lite/lib/index.css';
import '@/styles/editor.css'; // Custom dark mode overrides
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { IncomingHttpStatusHeader } from 'http2';

// Initialize markdown parser with highlight.js
const mdParser = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
});

// Configure Spanish Locale
MdEditor.addLocale('es-ES', {
  clear: 'Limpiar',
  bold: 'Negrita',
  italic: 'Cursiva',
  header: 'Encabezado',
  underline: 'Subrayado',
  strikethrough: 'Tachado',
  mark: 'Resaltar',
  quote: 'Cita',
  list: 'Lista',
  ordered: 'Lista numerada',
  link: 'Enlace',
  image: 'Imagen',
  code: 'Código',
  table: 'Tabla',
  fullScreen: 'Pantalla completa',
  menu: 'Menú',
  html: 'HTML',
  view: 'Vista',
  both: 'Ambos',
  preview: 'Previsualización'
});
MdEditor.useLocale('es-ES');

interface WikiEditorProps {
  initialSlug?: string;
  initialTitle?: string;
  initialContent?: string;
}

export default function WikiEditor({
  initialSlug = '',
  initialTitle = '',
  initialContent = ''
}: WikiEditorProps) {
  const [slug, setSlug] = useState(initialSlug);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  function handleEditorChange({ text }: { text: string }) {
    setContent(text);
  }

  async function handleSave() {
    if (!slug || !title || !content) {
      alert('Se requieren la Ruta, el Título y el Contenido');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/wiki/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug, title, content })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el artículo');
      }

      alert('¡Artículo guardado exitosamente!');
    } catch (error) {
      console.error('Error guardando:', error);
      const { message = '' } = error;
      alert(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4 bg-card text-card-foreground rounded-lg border shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="slug"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ruta (URL)
          </label>
          <input
            id="slug"
            type="text"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            )}
            placeholder="ejemplo-manual"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Título del Artículo
          </label>
          <input
            id="title"
            type="text"
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            )}
            placeholder="Mi Gran Artículo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-[500px] border rounded-md overflow-hidden relative">
        {/* We use a custom renderHTML to wrap it in the prose class for Tailwind Typography */}
        <MdEditor
          style={{ height: '500px' }}
          renderHTML={(text) => (
            // This wrapper div ensures the preview inside the editor has standard typography styles
            <div className="prose prose-slate dark:prose-invert max-w-none p-4">
              <span
                dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}
              />
            </div>
          )}
          onChange={handleEditorChange}
          value={content}
          view={{ menu: true, md: true, html: true }}
          config={{
            options: {
              html: true
            },
            view: {
              menu: true,
              md: true,
              html: true
            },
            canView: {
              menu: true,
              md: true,
              html: true,
              both: true,
              fullScreen: true,
              hideMenu: true
            }
          }}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar Artículo'}
        </Button>
      </div>
    </div>
  );
}
