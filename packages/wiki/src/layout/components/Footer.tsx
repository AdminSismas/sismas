export function Footer() {
  return (
    <footer className="border-t border-(--color-border) py-6">
      <p className="text-center text-sm text-(--color-text-muted)">
        © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
