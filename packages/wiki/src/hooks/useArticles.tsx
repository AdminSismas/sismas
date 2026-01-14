import type { WikiArticle } from '@lib/db';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export function useArticle() {
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    title: '',
    description: ''
  });

  const closeAlert = (isOpen: boolean) => {
    setAlertState((prev) => ({ ...prev, open: isOpen }));
  };

  async function createArticle({ slug, title, content }: WikiArticle) {
    if (!slug || !title || !content) {
      setAlertState({
        open: true,
        title: 'Campos Requeridos',
        description: 'Se requieren la Ruta, el Título y el Contenido'
      });
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
        const data = await response.json();
        throw new Error(data.message || 'Error al guardar');
      }
      const urlArticle = document.location.href.replace(
        '/admin',
        '/manual/' + slug
      );

      setAlertState({
        open: true,
        title: 'Operación Exitosa',
        description:
          '¡Artículo guardado exitosamente en la ruta ' + urlArticle + '!'
      });
    } catch (error: any) {
      console.error('Error guardando:', error);
      const message = error?.message || 'Error desconocido';
      setAlertState({
        open: true,
        title: 'Error',
        description: message
      });
    } finally {
      setIsSaving(false);
    }
  }

  const ArticleAlert = (
    <AlertDialog
      open={alertState.open}
      onOpenChange={closeAlert}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertState.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertState.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => closeAlert(false)}>
            Aceptar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    createArticle,
    isSaving,
    ArticleAlert
  };
}
