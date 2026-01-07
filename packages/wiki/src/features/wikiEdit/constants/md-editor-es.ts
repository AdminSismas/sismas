import { commands } from "@uiw/react-md-editor";

// Función para traducir los títulos de los comandos
export const esCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.group([commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6], {
    name: 'title',
    groupName: 'title',
    buttonProps: { 'aria-label': 'Insertar título', title: 'Insertar título' }
  }),
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.image,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand
];

// Mapeo manual de nombres para traducir los tooltips
export const translatedCommands = esCommands.map((cmd) => {
  switch (cmd.name) {
    case 'bold':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Negrita' };
      break;
    case 'italic':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Cursiva' };
      break;
    case 'strikethrough':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Tachado' };
      break;
    case 'hr':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Línea horizontal' };
      break;
    case 'link':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Insertar enlace' };
      break;
    case 'quote':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Cita' };
      break;
    case 'code':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Código' };
      break;
    case 'image':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Insertar imagen' };
      break;
    case 'unordered-list':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Lista desordenada' };
      break;
    case 'ordered-list':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Lista ordenada' };
      break;
    case 'checked-list':
      cmd.buttonProps = { ...cmd.buttonProps, title: 'Lista de tareas' };
      break;
  }
  return cmd;
});

export const translatedExtraCommands = [
  commands.codeEdit,
  commands.codeLive,
  commands.codePreview,
  commands.divider,
  commands.fullscreen,
].map((cmd) => {
  // Traducción lógica para la derecha
  if (cmd.name === 'edit') cmd.buttonProps = { ...cmd.buttonProps, title: 'Modo Edición' };
  if (cmd.name === 'live') cmd.buttonProps = { ...cmd.buttonProps, title: 'Vista Dividida' };
  if (cmd.name === 'preview') cmd.buttonProps = { ...cmd.buttonProps, title: 'Vista Previa' };
  if (cmd.name === 'fullscreen') cmd.buttonProps = { ...cmd.buttonProps, title: 'Pantalla Completa' };
  return cmd;
});